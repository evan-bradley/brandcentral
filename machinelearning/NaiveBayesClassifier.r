library(RMySQL)
library(e1071)

lapply( dbListConnections( dbDriver( drv = "MySQL")), dbDisconnect)
mydb = dbConnect(MySQL(), user='root', password='somethingeasy', dbname='BRAND_CENTRAL', host='138.197.85.34')

tag_query = dbSendQuery(mydb, "select * from TAG")
tags = fetch(tag_query, n=-1)

prod_tag_addign_query = dbSendQuery(mydb, "select * from PROD_TAG_ASSIGN")
prod_tags = fetch(prod_tag_addign_query, n=-1)

likes_query = dbSendQuery(mydb, "select * from LIKES WHERE USER_ID=2")
likes = fetch(likes_query, n=-1)

dislikes_query = dbSendQuery(mydb, "select * from DISLIKES WHERE USER_ID=2")
dislikes = fetch(dislikes_query, n=-1)

rm(like_tag_matrix)
rm(dislike_tag_matrix)

for(product in likes$PRODUCT_ID) {
  product_id = product
  prod_tag_list <- as.matrix((tags$TAG_ID %in% prod_tags[prod_tags$PRODUCT_ID == product_id,]$TAG_ID)*1)
  if(!exists("like_tag_matrix")) {
    like_tag_matrix <- t(prod_tag_list)
  }else{
    like_tag_matrix <- rbind(like_tag_matrix, t(prod_tag_list))
  }
}

for(product in dislikes$PRODUCT_ID) {
  product_id = product
  prod_tag_list <- as.matrix((tags$TAG_ID %in% prod_tags[prod_tags$PRODUCT_ID == product_id,]$TAG_ID)*1)
  if(!exists("dislike_tag_matrix")) {
    dislike_tag_matrix <- t(prod_tag_list)
  }else{
    dislike_tag_matrix <- rbind(dislike_tag_matrix, t(prod_tag_list))
  }
}

class_1 <- cbind(like_tag_matrix, 1)
class_2 <- cbind(dislike_tag_matrix, 2)

tag_matix <- data.frame(rbind(class_1, class_2))

## 75% of the sample size
smp_size <- floor(0.75 * nrow(tag_matix))

## set the seed to make your partition reproductible
set.seed(123)
train_ind <- sample(seq_len(nrow(tag_matix)), size = smp_size)

train <- tag_matix[train_ind, ]
test <- tag_matix[-train_ind, ]

x <- train[,-ncol(train)]
y <- train[,ncol(train)]

m <- naiveBayes(train[,-ncol(train)], as.factor(train[,ncol(train)]))
p <- predict(m, test[,-ncol(test)])

m <- naiveBayes(X2380 ~ ., data.frame(train))
p <- predict(m, data.frame(test[,-ncol(test)]))

table(p, test[,ncol(test)])
