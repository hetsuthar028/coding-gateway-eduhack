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
                    docker build . -t bismabaig/node-app:latest $BRANCH_NAME
                    docker push bismabaig/node-app:latest $BRANCH_NAME
                    '''
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
