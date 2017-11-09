# Loads necessary packages into the system.
load_packages <- function() {
    needed <- c("DBI", "RMySQL", "e1071", "rpart", "gridExtra", "neuralnet")
    lapply(needed, require, character.only = TRUE)
}

# Connects to the MySQL database.
connect_to_db <- function() {
    lapply(dbListConnections(dbDriver( drv = "MySQL")), dbDisconnect)
    dbConnect(MySQL(), user='root', password='somethingeasy', dbname='BRAND_CENTRAL', host='138.197.85.34')
}

# Returns a matrix of tags.
get_tags <- function(db) {
    tag_query <- dbSendQuery(db, "select * from TAG where TAG_ACTIVE = 'YES'")
    tags <- fetch(tag_query, n=-1)
    # write.csv(tags, file = "tags.csv")
    return(tags)
}

get_product_tags <- function(db) {
    prod_tag_assign_query <- dbSendQuery(db, "select product_id, tag_id from PROD_TAG_ASSIGN")
    prod_tags <- fetch(prod_tag_assign_query, n=-1)
    # write.csv(prod_tags, file = "prod_tags.csv")
    return(prod_tags)
}

get_likes_matrix <- function(db, id, tags, prod_tags) {
    likes_query <- dbSendQuery(db, paste("select * from LIKES WHERE USER_ID =", id, sep = " "))
    likes <- fetch(likes_query, n=-1)
    # write.csv(likes, file = "likes.csv")

    for(product in likes$PRODUCT_ID) {
        product_id <- product
        prod_tag_list <- as.matrix((tags$TAG_ID %in% prod_tags[prod_tags$product_id == product_id,]$tag_id)*1)
        if(!exists("like_tag_matrix")) {
            like_tag_matrix <- t(prod_tag_list)
        } else {
            like_tag_matrix <- rbind(like_tag_matrix, t(prod_tag_list))
        }
    }

    # write.csv(like_tag_matrix, file = "like_tag_matrix.csv")
    return(like_tag_matrix)
}

get_dislikes_matrix <- function(db, id, tags, prod_tags) {
    dislikes_query <- dbSendQuery(db, paste("select * from DISLIKES WHERE USER_ID =", id, sep = " "))
    dislikes <- fetch(dislikes_query, n=-1)
    # write.csv(dislikes, file = "dislikes.csv")

    for(product in dislikes$PRODUCT_ID) {
        product_id <- product
        prod_tag_list <- as.matrix((tags$TAG_ID %in% prod_tags[prod_tags$product_id == product_id,]$tag_id)*1)
        if(!exists("dislike_tag_matrix")) {
            dislike_tag_matrix <- t(prod_tag_list)
        } else {
            dislike_tag_matrix <- rbind(dislike_tag_matrix, t(prod_tag_list))
        }
    }

    # write.csv(dislike_tag_matrix, file = "dislike_tag_matrix.csv")
    return(dislike_tag_matrix)
}

get_training_data <- function() {
    mydb <- connect_to_db()
    tags <- get_tags(mydb)
    prod_tags <- get_product_tags(mydb)

    like_tag_matrix <- get_likes_matrix(mydb, 2, tags, prod_tags)
    dislike_tag_matrix <- get_dislikes_matrix(mydb, 2, tags, prod_tags)

    class_1 <- cbind(like_tag_matrix, 1)
    class_2 <- cbind(dislike_tag_matrix, 2)

    tag_matrix <- data.frame(rbind(class_1, class_2))

    # write.csv(tag_matrix, file = "tag_matrix.csv")
    return(tag_matrix)
}

classify_naive_bayes <- function() {
    tag_matrix <- get_training_data()

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

classify_neural_network <- function() {
    tag_matrix <- get_training_data()
    
    ## 75% of the sample size
    smp_size <- floor(0.75 * nrow(tag_matrix))
    
    ## set the seed to make your partition reproductible
    set.seed(123)
    train_ind <- sample(seq_len(nrow(tag_matrix)), size = smp_size)
    
    train <- tag_matrix[train_ind, ]
    test <- tag_matrix[-train_ind, ]
    
    train <- cbind(train[, 1:975], class.ind(as.factor(train$X975)))
    names(train) <- c(names(train)[1:975],"l1","l2")
    n <- names(train)
    f <- as.formula(paste("l1 + l2 + ~", paste(n[!n %in% c("l1","l2")], collapse = " + ")))
    nn <- neuralnet(f, data = train, hidden = c(500), act.fct = "logistic", linear.output = FALSE, lifesign = "minimal")
    pr.nn <- compute(nn, test_data)
    pr.nn_ <- pr.nn$net.result
    pr.nn_2 <- max.col(pr.nn_)
    mean(pr.nn_2 == test_labels)
    print(confusionMatrix(unlist(pr.nn_2), unlist(test_labels)))
}

classify_decision_tree <- function() {
    tag_matrix <- get_training_data()

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
}
