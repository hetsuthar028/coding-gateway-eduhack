pipeline {
    agent {
        label 'new_server'
    }
    environment {
       
        DOCKER_CREDS = credentials('bismabaig')
        DOCKER_CREDS_PSW = 
    }
    stages {
        stage('Git') {
            steps {
                git credentialsId: 'githubnew', url: 'https://github.com/BismaNaeemBaig31/coding-gateway-eduhack.git'
            }
        }
        stage('Build') {
            
            steps {
                script {
                    docker login -u $DOCKER_CREDS_USR -p $DOCKER_CREDS_PSW
                    docker build . "-t bismabaig/node-app:$BUILD_ID -t bismabaig/node-app:prod-$BUILD_ID"
                    docker push "bismabaig/node-app:$BUILD_ID"
                }
            }
        }
        stage('master Branch') {
            
            steps {
                script {
                    docker build . "-t bismabaig/node-app:$BUILD_ID -t bismabaig/node-app:dev-$BUILD_ID"
                    docker push "bismabaig/node-app:$BUILD_ID"
                }
            }
        }
    } // end of stages
}
