pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                script {
                    sh 'docker compose up --build -d'
                }
            }
        }
    }
}
