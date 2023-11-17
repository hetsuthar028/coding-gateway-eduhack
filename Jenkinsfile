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
                    docker login -u $DOCKER_CREDS_USR -p $DOCKER_CREDS_PSW
                    docker build . "-t bismabaig/node-app"
                    docker push "bismabaig/node-app"
                }
            }
        }
    } 
}
