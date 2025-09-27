
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
        PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Checking out branch: ${env.BRANCH_NAME ?: 'main'}"
            }
        }
        
        stage('Install Node.js') {
            steps {
                script {
                    sh '''
                        echo "=== Installing Node.js ==="
                        
                        # Pridaj možné cesty pre Homebrew
                        export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
                        
                        # Skontroluj či už nie je nainštalovaný
                        if command -v node &> /dev/null; then
                            echo "Node.js is already installed:"
                            node --version
                            npm --version
                        else
                            echo "Installing Node.js via Homebrew..."
                            
                            # Skontroluj či je Homebrew dostupný
                            if command -v brew &> /dev/null; then
                                echo "Homebrew found, installing Node.js..."
                                brew install node || {
                                    echo "Homebrew install failed, trying with sudo..."
                                    sudo brew install node || {
                                        echo "Both attempts failed, trying direct download..."
                                        # Fallback: stiahnuť Node.js priamo
                                        curl -fsSL https://nodejs.org/dist/v18.19.0/node-v18.19.0-darwin-x64.tar.gz -o node.tar.gz
                                        tar -xzf node.tar.gz
                                        export PATH="$PWD/node-v18.19.0-darwin-x64/bin:$PATH"
                                        echo "Node.js installed locally"
                                        node --version
                                        npm --version
                                    }
                                }
                            else
                                echo "Homebrew not found, installing it first..."
                                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || {
                                    echo "Homebrew installation failed, using direct Node.js download..."
                                    curl -fsSL https://nodejs.org/dist/v18.19.0/node-v18.19.0-darwin-x64.tar.gz -o node.tar.gz
                                    tar -xzf node.tar.gz
                                    export PATH="$PWD/node-v18.19.0-darwin-x64/bin:$PATH"
                                    echo "Node.js installed locally"
                                }
                            fi
                            
                            # Finálne overenie
                            node --version || echo "Node.js installation may have failed"
                            npm --version || echo "NPM installation may have failed"
                        fi
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo 'Installing dependencies...'
                    sh '''
                        # Nastavenie PATH pre Node.js
                        export PATH="/opt/homebrew/bin:/usr/local/bin:$PWD/node-v18.19.0-darwin-x64/bin:$PATH"
                        
                        # Overenie dostupnosti npm
                        if ! command -v npm &> /dev/null; then
                            echo "NPM still not found, exiting..."
                            exit 1
                        fi
                        
                        echo "Using NPM version: $(npm --version)"
                        
                        # Inštalácia závislostí
                        if [ -f "package-lock.json" ]; then
                            echo "Found package-lock.json, using npm ci"
                            npm ci
                        else
                            echo "Using npm install"
                            npm install
                        fi
                        
                        # Skús nainštalovať yarn globálne
                        npm install -g yarn || echo "Yarn global install failed, continuing with npm"
                    '''
                }
            }
        }
        
        stage('Verify Cypress') {
            steps {
                sh '''
                    # Nastavenie PATH
                    export PATH="/opt/homebrew/bin:/usr/local/bin:$PWD/node-v18.19.0-darwin-x64/bin:$PATH"
                    
                    echo "Verifying Cypress installation..."
                    npx cypress verify
                    echo "Cypress info:"
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
                        # Nastavenie PATH
                        export PATH="/opt/homebrew/bin:/usr/local/bin:\$PWD/node-v18.19.0-darwin-x64/bin:\$PATH"
                        
                        # Vytvor potrebné adresáre
                        mkdir -p ${ALLURE_RESULTS_DIR}
                        mkdir -p cypress/screenshots
                        mkdir -p cypress/videos
                        mkdir -p cypress/results
                        
                        # Spusti Cypress testy
                        echo "Running Cypress tests..."
                        npm run cy:test:run || {
                            echo "Package script failed, trying direct command..."
                            npx cypress run \\
                                --browser ${params.BROWSER} \\
                                ${browserFlag} \\
                                --env configFile=${configFile} \\
                                || true
                        }
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
                        # Nastavenie PATH
                        export PATH="/opt/homebrew/bin:/usr/local/bin:$PWD/node-v18.19.0-darwin-x64/bin:$PATH"
                        
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
                            npm run allure:report || npx allure generate ${ALLURE_RESULTS_DIR} --clean -o ${ALLURE_REPORT_DIR} || {
                                echo "Allure report generation failed"
                            }
                            
                            echo "Allure report generation completed"
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
                            [pattern: 'node_modules/**', type: 'EXCLUDE'],
                            [pattern: 'node-v18.19.0-darwin-x64/**', type: 'EXCLUDE']
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
