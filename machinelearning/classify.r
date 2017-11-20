needed <- c("DBI", "RMySQL", "e1071", "rpart", "gridExtra", "neuralnet", "nnet", "caret", "jsonlite")

install_packages <- function() {
    install.packages(needed)
}

# Loads necessary packages into the system.
load_packages <- function() {
    lapply(needed, require, character.only = TRUE)
}
load_packages()

# Connects to the MySQL database.
connect_to_db <- function() {
    lapply(dbListConnections(dbDriver( drv = "MySQL")), dbDisconnect)
    dbConnect(MySQL(), user='root', password='somethingeasy', dbname='BRAND_CENTRAL', host='138.197.85.34')
}
mysqldb <- connect_to_db()

# Returns a matrix of tags.
get_tags <- function(db) {
    dbGetQuery(db, "select * from TAG where TAG_ACTIVE = 'YES'")
}

get_product_tags <- function(db) {
    dbGetQuery(db, "select product_id, tag_id from PROD_TAG_ASSIGN")
}

get_products <- function(db) {
    dbGetQuery(db, "select product_id from PRODUCT")
}

make_tag_matrix <- function(products, tags, prod_tags) {
    for(product in products$PRODUCT_ID) {
        product_id <- product
        prod_tag_list <- as.matrix((tags$TAG_ID %in% prod_tags[prod_tags$product_id == product_id,]$tag_id)*1)
        if(!exists("product_tag_matrix")) {
            product_tag_matrix <- t(prod_tag_list)
        } else {
            product_tag_matrix <- rbind(product_tag_matrix, t(prod_tag_list))
        }
    }

    return(product_tag_matrix)
}

get_likes <- function(db, id) {
    dbGetQuery(db, "SELECT * FROM LIKES")
}

get_dislikes <- function(db, id) {
    dbGetQuery(db, "SELECT * FROM DISLIKES")
}

get_likes_user <- function(db, id) {
    dbGetQuery(db, paste("select * from LIKES WHERE USER_ID =", id, sep = " "))
}

get_dislikes_user <- function(db, id) {
    dbGetQuery(db, paste("select * from DISLIKES WHERE USER_ID =", id, sep = " "))
}

store_weight_vector <- function(db, id, vec) {
    weight_csv <- paste(vec, collapse=",")
    dbGetQuery(db, paste("UPDATE USER SET USER_VECTOR = '", weight_csv , "'  WHERE USER_ID = ", id, sep = ""))
}

get_weight_vector <- function(db, id) {
    weight_csv <- dbGetQuery(db, paste("SELECT USER_VECTOR FROM USER WHERE USER_ID =", id, sep = " "))
    read.table(textConnection(weight_csv$USER_VECTOR), sep=",")
}

get_training_data <- function(id) {
    mydb = mysqldb
    tags <- get_tags(mydb)
    prod_tags <- get_product_tags(mydb)
    likes <- get_likes(mydb, id)
    dislikes <- get_dislikes(mydb, id)

    like_tag_matrix <- make_tag_matrix(likes, tags, prod_tags)
    dislike_tag_matrix <- make_tag_matrix(dislikes, tags, prod_tags)

    class_1 <- cbind(like_tag_matrix, Liked=1)
    class_2 <- cbind(dislike_tag_matrix, Liked=2)

    tag_matrix <- data.frame(rbind(class_1, class_2))

    # write.csv(tag_matrix, file = "tag_matrix.csv")
    return(tag_matrix)
}

classify_naive_bayes <- function(tag_matrix) {
    ## 75% of the sample size
    smp_size <- floor(0.75 * nrow(tag_matrix))

    ## set the seed to make your partition reproductible
    set.seed(123)
    train_ind <- sample(seq_len(nrow(tag_matrix)), size = smp_size)

    train <- tag_matrix[train_ind, ]
    test <- tag_matrix[-train_ind, ]

    m <- naiveBayes(as.factor(X975) ~ ., train)
    p <- predict(m, data.frame(test[,-ncol(test)]))

    grid.table(table(p, test[,ncol(test)]))
    plot(sort(colSums(tag_matrix)), type="l")
    print(sort(colSums(tag_matrix)))
}

classify_neural_network <- function(tag_matrix) {
    ## 75% of the sample size
    smp_size <- floor(0.75 * nrow(tag_matrix))

    ## set the seed to make your partition reproductible
    set.seed(123)
    train_ind <- sample(seq_len(nrow(tag_matrix)), size = smp_size)

    train <- tag_matrix[train_ind, ]
    test <- tag_matrix[-train_ind, ]

    train <- cbind(train[, 1:974], class.ind(as.factor(train$Liked)))
    names(train) <- c(names(train)[1:974],"l1","l2")
    n <- names(train)
    f <- as.formula(paste("l1 + l2 ~", paste(n[!n %in% c("l1","l2")], collapse = " + ")))
    nn <- neuralnet(f, data = train, hidden = c(50, 50), act.fct = "logistic", linear.output = FALSE, lifesign = "minimal")
    pr.nn <- compute(nn, test[,1:974])
    pr.nn_ <- pr.nn$net.result
    pr.nn_2 <- max.col(pr.nn_)
    mean(pr.nn_2 == test[,975])
    print(confusionMatrix(unlist(pr.nn_2), unlist(test[,975])))
}

classify_decision_tree <- function(tag_matrix) {
    ## 75% of the sample size
    smp_size <- floor(0.75 * nrow(tag_matrix))

    ## set the seed to make your partition reproductible
    set.seed(123)
    train_ind <- sample(seq_len(nrow(tag_matrix)), size = smp_size)

    train <- tag_matrix[train_ind, ]
    test <- tag_matrix[-train_ind, ]

    fit <- rpart(X975 ~ ., data.frame(train), method="class")
    p <- predict(fit, data.frame(test[,-ncol(test)]), type = "class")

    table(p, test[,ncol(test)])
    return(fit)
}

get_weighted_training_data <- function() {
    mydb = mysqldb
    tags <- get_tags(mydb)
    prod_tags <- get_product_tags(mydb)
    likes <- get_likes(mydb)
    dislikes <- get_dislikes(mydb)

    likes_matrix <- make_tag_matrix(likes, tags, prod_tags)
    dislikes_matrix <- make_tag_matrix(dislikes, tags, prod_tags)

    likes_matrix_sums <- colSums(likes_matrix)
    dislikes_matrix_sums <- colSums(dislikes_matrix)
    total_sums <- likes_matrix_sums - dislikes_matrix_sums

    neg_vec <- rep(-1, ncol(dislikes_matrix))

    # TODO: Maybe just multiply these rather than sweeping them
    adjusted_likes <- sweep(likes_matrix, MARGIN=2, total_sums, `*`)
    adjusted_dislikes <- sweep(dislikes_matrix, MARGIN=2, total_sums, `*`)

    class_1 <- cbind(adjusted_likes, Liked=1)
    class_2 <- cbind(adjusted_dislikes, Liked=2)

    tag_matrix <- data.frame(rbind(class_1, class_2))

    return(tag_matrix)
    #return(list(tag_matrix, total_sums))
}

make_user_weight_vector <- function() {
    mydb = mysqldb
    tags <- get_tags(mydb)
    prod_tags <- get_product_tags(mydb)
    likes <- get_likes_user(mydb, id)
    dislikes <- get_dislikes_user(mydb, id)

    likes_matrix <- make_tag_matrix(likes, tags, prod_tags)
    dislikes_matrix <- make_tag_matrix(dislikes, tags, prod_tags)

    likes_matrix_sums <- colSums(likes_matrix)
    dislikes_matrix_sums <- colSums(dislikes_matrix)
    total_sums <- likes_matrix_sums - dislikes_matrix_sums

    store_weight_vector(mydb, id, total_sums)
}

train_classifiers <- function(tag_matrix) {
    nb <- naiveBayes(as.factor(Liked) ~ ., tag_matrix)
    lr <- lm(as.factor(Liked) ~ ., tag_matrix)
    dt <- rpart(as.factor(Liked) ~ ., tag_matrix, method="class")

    tag_matrix <- cbind(tag_matrix[, 1:974], class.ind(as.factor(tag_matrix$Liked)))
    names(tag_matrix) <- c(names(tag_matrix)[1:974],"l1","l2")
    n <- names(tag_matrix)
    f <- as.formula(paste("l1 + l2 ~", paste(n[!n %in% c("l1","l2")], collapse = " + ")))
    nn <- neuralnet(f, data = tag_matrix, hidden = c(50, 50), act.fct = "logistic", linear.output = FALSE, lifesign = "minimal")

    saveRDS(nb, file = "general_nb.rds")
    saveRDS(lr, file = "general_lr.rds")
    saveRDS(dt, file = "general_dt.rds")
    saveRDS(nn, file = "general_nn.rds")
}

classify_product <- function(model, product, weight) {
    weighted_product <- product * as.numeric(unlist(weight))
    predict(model, weighted_product)
}

server <- function() {
    db = mysqldb
    tags <- get_tags(db)
    prod_tags <- get_product_tags(db)
    products <- get_products(db)
    print("Read tables")
    nb_model <- readRDS("general_nb.rds")
    print("Read model")

    while(TRUE) {
        writeLines("Listening...")
        con <- socketConnection(host="localhost", port = 6011, blocking=TRUE,
                                server=TRUE, open="r+")
        while(TRUE) {
            data <- readLines(con, 1)
            msg <- fromJSON(data)
            print(msg)
            if (msg$cmd == "classify") {
                response <- classify_product(nb_model, products[as.numeric(msg$product), ],
                                             get_weight_vector(mysqldb, msg$id))
            } else if (msg$cmd == "train") {
                response <- train_classifiers(msg$id, get_weighted_training_data(msg$id))
            } else if (msg$cmd == "bye") {
                close(con)
                break;
            }
            writeLines(toJSON(response), con)
        }
    }
}
server()
