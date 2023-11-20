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
                    def EXT_PORT
                    if (BRANCH_NAME == 'dev') {
                        EXT_PORT = 1480
                    } else {
                        EXT_PORT = 1580
                    }
                    sh '''
                        docker login -u $DOCKER_CREDS_USR -p $DOCKER_CREDS_PSW
                        docker build . -t bismabaig/node-app:$BRANCH_NAME-latest -t bismabaig/node-app:$BRANCH_NAME-$BUILD_ID
                        docker push bismabaig/node-app:$BRANCH_NAME-latest
                        docker push bismabaig/node-app:$BRANCH_NAME-$BUILD_ID
                    '''
                }
            }
        }
    }
    post { 
        success {
            sh 'docker-compose up -d'
        }
        failure { 
            echo 'Build failed!'
        }
    }
}
