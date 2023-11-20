pipeline {
    agent {
        label 'new_server'
    }
    environment {
        DOCKER_CREDS = credentials('dockerhub_id')
         
        
    }
    stages {
        stage('Build') {
            steps {
                script {
                    sh '''
                    docker login -u $DOCKER_CREDS_USR -p $DOCKER_CREDS_PSW
                    docker build . -t bismabaig/node-app:$BRANCH_NAME-latest
                    docker push bismabaig/node-app:$BRANCH_NAME-latest
                    '''
                }
            }
        }
        stage('Dev Branch') {
    steps {
        script {
            docker.build(".")
                  .t("bismabaig/node-app:${BUILD_ID}")
                  .t("bismabaig/node-app:dev-${BUILD_ID}")
                  .execute()
        }
    }
}
    }
    post { 
        success {
               sh  'docker compose up -d'
    }
        failure { 
        sh "echo 'stage is fail'"
        }
 }
}
