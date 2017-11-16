# Loads necessary packages into the system.
load_packages <- function() {
    needed <- c("DBI", "RMySQL", "e1071", "rpart", "gridExtra", "neuralnet", "nnet", "caret")
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
    tags <- dbGetQuery(db, "select * from TAG where TAG_ACTIVE = 'YES'")
    # write.csv(tags, file = "tags.csv")
    return(tags)
}

get_product_tags <- function(db) {
    prod_tags <- dbGetQuery(db, "select product_id, tag_id from PROD_TAG_ASSIGN")
    # write.csv(prod_tags, file = "prod_tags.csv")
    return(prod_tags)
}

make_tag_matrix <- function(likes, tags, prod_tags) {
    for(product in likes$PRODUCT_ID) {
        product_id <- product
        prod_tag_list <- as.matrix((tags$TAG_ID %in% prod_tags[prod_tags$product_id == product_id,]$tag_id)*1)
        if(!exists("like_tag_matrix")) {
            like_tag_matrix <- t(prod_tag_list)
        } else {
            like_tag_matrix <- rbind(like_tag_matrix, t(prod_tag_list))
        }
    }

    return(like_tag_matrix)
}

get_likes <- function(db, id) {
    likes <- dbGetQuery(db, paste("select * from LIKES WHERE USER_ID =", id, sep = " "))
    # write.csv(likes, file = "likes.csv")

    return(likes)
}

get_dislikes <- function(db, id) {
    dislikes <- dbGetQuery(db, paste("select * from DISLIKES WHERE USER_ID =", id, sep = " "))
    # write.csv(dislikes, file = "dislikes.csv")

    return(dislikes)
}

get_training_data <- function(id) {
    mydb = mysqldb
    tags <- get_tags(mydb)
    prod_tags <- get_product_tags(mydb)
    likes <- get_likes(mydb, id)
    dislikes <- get_dislikes(mydb, id)

    like_tag_matrix <- make_tag_matrix(likes, tags, prod_tags)
    dislike_tag_matrix <- make_tag_matrix(dislikes, tags, prod_tags)

    class_1 <- cbind(like_tag_matrix, 1)
    class_2 <- cbind(dislike_tag_matrix, 2)

    tag_matrix <- data.frame(rbind(class_1, class_2))

    # write.csv(tag_matrix, file = "tag_matrix.csv")
    return(tag_matrix)
}

classify_naive_bayes <- function(id) {
    tag_matrix <- get_training_data(id)

    ## 75% of the sample size
    smp_size <- floor(0.75 * nrow(tag_matrix))

    ## set the seed to make your partition reproductible
    set.seed(123)
    train_ind <- sample(seq_len(nrow(tag_matrix)), size = smp_size)

    train <- tag_matrix[train_ind, ]
    test <- tag_matrix[-train_ind, ]

    # x <- train[,-ncol(train)]
    # y <- train[,ncol(train)]
    # test <- test[,-ncol(test)]

    # nb <- naiveBayes(train, as.factor(labels))
    # p <- predict(nb, as.factor(test))

    # Previously X2380
    m <- naiveBayes(as.factor(X975) ~ ., train)
    p <- predict(m, data.frame(test[,-ncol(test)]))

    grid.table(table(p, test[,ncol(test)]))
    plot(sort(colSums(tag_matrix)), type="l")
    print(sort(colSums(tag_matrix)))
}

classify_neural_network <- function(id) {
    tag_matrix <- get_training_data(id)
    
    ## 75% of the sample size
    smp_size <- floor(0.75 * nrow(tag_matrix))
    
    ## set the seed to make your partition reproductible
    set.seed(123)
    train_ind <- sample(seq_len(nrow(tag_matrix)), size = smp_size)
    
    train <- tag_matrix[train_ind, ]
    test <- tag_matrix[-train_ind, ]
    
    train <- cbind(train[, 1:974], class.ind(as.factor(train$X975)))
    names(train) <- c(names(train)[1:974],"l1","l2")
    n <- names(train)
    f <- as.formula(paste("l1 + l2 ~", paste(n[!n %in% c("l1","l2")], collapse = " + ")))
    nn <- neuralnet(f, data = train, hidden = c(50, 50, 50, 50, 50, 50, 50), act.fct = "logistic", linear.output = FALSE, lifesign = "minimal")
    pr.nn <- compute(nn, test[,1:974])
    pr.nn_ <- pr.nn$net.result
    pr.nn_2 <- max.col(pr.nn_)
    mean(pr.nn_2 == test[,975])
    print(confusionMatrix(unlist(pr.nn_2), unlist(test[,975])))
}

classify_decision_tree <- function(id) {
    tag_matrix <- get_training_data(id)

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
