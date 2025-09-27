
pipeline {
    agent any
    
    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chrome', 'firefox', 'edge'],
            description: 'Browser pre spustenie testov'
        )
        choice(
            name: 'ENV',
            choices: ['test', 'staging', 'prod'],
            description: 'Prostredie pre spustenie testov'
        )
        booleanParam(
            name: 'HEADLESS',
            defaultValue: true,
            description: 'Spustiť testy v headless mode'
        )
    }
    
    environment {
        CYPRESS_CACHE_FOLDER = "${WORKSPACE}/.cache/cypress"
        ALLURE_RESULTS_DIR = 'allure-results'
        ALLURE_REPORT_DIR = 'allure/report'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Checking out branch: ${env.BRANCH_NAME}"
            }
        }
        
        stage('Setup Node.js') {
            steps {
                script {
                    // Overenie Node.js verzie
                    sh '''
                        echo "Current Node.js version:"
                        node --version || echo "Node.js not found"
                        echo "Current NPM version:"
                        npm --version || echo "NPM not found"
                        
                        # Ak node nie je nainštalovaný, použijeme system default
                        if ! command -v node &> /dev/null; then
                            echo "Node.js not found, trying to install via package manager"
                            # Pre macOS s Homebrew
                            if command -v brew &> /dev/null; then
                                brew install node@18 || true
                            fi
                        fi
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo 'Installing dependencies with Yarn/NPM...'
                    sh '''
                        # Skús yarn, ak nie je dostupný použij npm
                        if command -v yarn &> /dev/null; then
                            echo "Using Yarn for package management"
                            yarn install --frozen-lockfile
                        else
                            echo "Yarn not found, installing via NPM"
                            npm install -g yarn || true
                            if command -v yarn &> /dev/null; then
                                yarn install --frozen-lockfile
                            else
                                echo "Using NPM for package management"
                                npm ci
                            fi
                        fi
                    '''
                }
            }
        }
        
        stage('Verify Cypress') {
            steps {
                sh '''
                    echo "Verifying Cypress installation..."
                    npx cypress verify || npm run cy:test:run --version
                    npx cypress info || echo "Cypress info not available"
                '''
            }
        }
        
        stage('Run Cypress Tests') {
            steps {
                script {
                    def browserFlag = params.HEADLESS ? "--headless" : ""
                    def configFile = params.ENV ?: 'test'
                    
                    echo "Running Cypress tests with browser: ${params.BROWSER}"
                    echo "Environment: ${configFile}"
                    echo "Headless mode: ${params.HEADLESS}"
                    
                    sh """
                        # Vytvor potrebné adresáre
                        mkdir -p ${ALLURE_RESULTS_DIR}
                        mkdir -p cypress/screenshots
                        mkdir -p cypress/videos
                        mkdir -p cypress/results
                        
                        # Spusti Cypress testy pomocou package.json scriptu
                        npm run cy:test:run || true
                        
                        # Backup: ak package script zlyhá, skús priamo
                        if [ ! -d "cypress/screenshots" ] && [ ! -d "cypress/videos" ]; then
                            echo "Running Cypress with direct command..."
                            npx cypress run \\
                                --browser ${params.BROWSER} \\
                                ${browserFlag} \\
                                --env configFile=${configFile} \\
                                || true
                        fi
                    """
                }
            }
            post {
                always {
                    script {
                        // Archivuj výsledky ak existujú
                        if (fileExists('cypress/screenshots')) {
                            archiveArtifacts artifacts: 'cypress/screenshots/**/*', allowEmptyArchive: true
                        }
                        if (fileExists('cypress/videos')) {
                            archiveArtifacts artifacts: 'cypress/videos/**/*', allowEmptyArchive: true
                        }
                        if (fileExists('cypress/results')) {
                            archiveArtifacts artifacts: 'cypress/results/**/*', allowEmptyArchive: true
                        }
                    }
                }
            }
        }
        
        stage('Generate Allure Report') {
            when {
                expression { fileExists(env.ALLURE_RESULTS_DIR) }
            }
            steps {
                script {
                    sh '''
                        echo "Generating Allure report..."
                        
                        # Skontroluj či existujú allure výsledky
                        if [ -d "${ALLURE_RESULTS_DIR}" ] && [ "$(ls -A ${ALLURE_RESULTS_DIR})" ]; then
                            echo "Found Allure results, generating report..."
                            
                            # Kopíruj historické dáta ak existujú
                            if [ -d "${ALLURE_REPORT_DIR}/history" ]; then
                                echo "Copying historical data..."
                                mkdir -p ${ALLURE_RESULTS_DIR}/history
                                cp -r ${ALLURE_REPORT_DIR}/history/* ${ALLURE_RESULTS_DIR}/history/ || true
                            fi
                            
                            # Vygeneruj Allure report
                            npm run allure:report || npx allure generate ${ALLURE_RESULTS_DIR} --clean -o ${ALLURE_REPORT_DIR}
                            
                            echo "Allure report generated successfully"
                        else
                            echo "No Allure results found, skipping report generation"
                        fi
                    '''
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo 'Pipeline finished'
                
                // Publikuj Allure report len ak existuje
                if (fileExists(env.ALLURE_RESULTS_DIR) && sh(script: "ls -A ${env.ALLURE_RESULTS_DIR}", returnStatus: true) == 0) {
                    try {
                        allure([
                            includeProperties: false,
                            jdk: '',
                            properties: [],
                            reportBuildPolicy: 'ALWAYS',
                            results: [[path: env.ALLURE_RESULTS_DIR]]
                        ])
                    } catch (Exception e) {
                        echo "Failed to publish Allure report: ${e.getMessage()}"
                    }
                } else {
                    echo "No Allure results to publish"
                }
                
                // Vyčisti workspace
                try {
                    cleanWs(
                        cleanWhenAborted: true,
                        cleanWhenFailure: false,
                        cleanWhenNotBuilt: false,
                        cleanWhenSuccess: true,
                        cleanWhenUnstable: false,
                        deleteDirs: true,
                        disableDeferredWipeout: true,
                        notFailBuild: true,
                        patterns: [
                            [pattern: '.cache/**', type: 'EXCLUDE'],
                            [pattern: 'node_modules/**', type: 'EXCLUDE']
                        ]
                    )
                } catch (Exception e) {
                    echo "Workspace cleanup failed: ${e.getMessage()}"
                }
            }
        }
        
        success {
            echo 'Pipeline completed successfully!'
        }
        
        failure {
            echo 'Pipeline failed!'
        }
        
        unstable {
            echo 'Pipeline is unstable!'
        }
    }
}
