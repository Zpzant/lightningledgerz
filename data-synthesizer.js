// =====================================================
// LIGHTNING LEDGERZ - FILE UPLOAD & DATA SYNTHESIS
// =====================================================
// Handles PDF/Excel uploads, data extraction, and analysis

class DataSynthesizer {
    constructor() {
        this.uploadedFiles = [];
        this.extractedData = null;
        this.processedBudgets = [];
    }

    async handleFileUpload(file) {
        try {
            if (file.type === 'application/pdf') {
                return await this.processPDF(file);
            } else if (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                return await this.processExcel(file);
            } else if (file.type.includes('text') || file.name.endsWith('.csv')) {
                return await this.processCSV(file);
            } else {
                throw new Error('Unsupported file type. Please upload PDF, Excel, or CSV files.');
            }
        } catch (error) {
            console.error('File processing error:', error);
            throw error;
        }
    }

    async processPDF(file) {
        // Using PDF.js library for PDF parsing
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
            fileReader.onload = async (e) => {
                try {
                    const pdfData = new Uint8Array(e.target.result);
                    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
                    
                    let extractedText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        extractedText += textContent.items.map(item => item.str).join(' ') + '\n';
                    }
                    
                    const structured = this.extractFinancialData(extractedText);
                    this.extractedData = {
                        source: 'PDF',
                        fileName: file.name,
                        rawText: extractedText,
                        structured: structured,
                        timestamp: new Date()
                    };
                    
                    resolve(structured);
                } catch (error) {
                    reject(error);
                }
            };
            fileReader.onerror = () => reject(new Error('Failed to read file'));
            fileReader.readAsArrayBuffer(file);
        });
    }

    async processExcel(file) {
        // Using SheetJS library for Excel parsing
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
            fileReader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    const result = {
                        sheets: {},
                        summary: {}
                    };
                    
                    workbook.SheetNames.forEach(sheetName => {
                        const worksheet = workbook.Sheets[sheetName];
                        result.sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet);
                    });
                    
                    this.extractedData = {
                        source: 'Excel',
                        fileName: file.name,
                        data: result,
                        timestamp: new Date()
                    };
                    
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            fileReader.onerror = () => reject(new Error('Failed to read file'));
            fileReader.readAsArrayBuffer(file);
        });
    }

    async processCSV(file) {
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
            fileReader.onload = (e) => {
                try {
                    const csv = e.target.result;
                    const lines = csv.split('\n');
                    const headers = lines[0].split(',');
                    const data = [];
                    
                    for (let i = 1; i < lines.length; i++) {
                        if (lines[i].trim()) {
                            const obj = {};
                            const values = lines[i].split(',');
                            headers.forEach((header, index) => {
                                obj[header.trim()] = values[index]?.trim();
                            });
                            data.push(obj);
                        }
                    }
                    
                    this.extractedData = {
                        source: 'CSV',
                        fileName: file.name,
                        data: data,
                        timestamp: new Date()
                    };
                    
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            fileReader.onerror = () => reject(new Error('Failed to read file'));
            fileReader.readAsText(file);
        });
    }

    extractFinancialData(text) {
        // Uses regex and AI to extract financial metrics
        const patterns = {
            revenue: /(?:revenue|sales|income)[\s:]*\$?([\d,]+\.?\d*)/gi,
            expenses: /(?:expenses?|costs?)[\s:]*\$?([\d,]+\.?\d*)/gi,
            budget: /(?:budget)[\s:]*\$?([\d,]+\.?\d*)/gi,
            profit: /(?:profit|net income)[\s:]*\$?([\d,]+\.?\d*)/gi
        };
        
        const extracted = {};
        Object.keys(patterns).forEach(key => {
            const matches = text.matchAll(patterns[key]);
            extracted[key] = Array.from(matches).map(m => parseFloat(m[1].replace(/,/g, '')));
        });
        
        return extracted;
    }

    synthesizeBudget(financialData) {
        // AI-powered budget analysis and synthesis
        const budget = {
            totalRevenue: this.sum(financialData.revenue || []),
            totalExpenses: this.sum(financialData.expenses || []),
            projectedProfit: 0,
            categories: {},
            recommendations: [],
            aiInsights: ''
        };
        
        budget.projectedProfit = budget.totalRevenue - budget.totalExpenses;
        
        // Generate AI insights (integrate with OpenAI API for better results)
        budget.aiInsights = this.generateInsights(budget);
        
        return budget;
    }

    generateInsights(budget) {
        let insights = '';
        
        if (budget.projectedProfit > 0) {
            const profitMargin = ((budget.projectedProfit / budget.totalRevenue) * 100).toFixed(2);
            insights += `Your profit margin is ${profitMargin}%. `;
        } else {
            insights += 'Warning: Current expenses exceed revenue. ';
        }
        
        const expenseRatio = ((budget.totalExpenses / budget.totalRevenue) * 100).toFixed(2);
        insights += `Expenses account for ${expenseRatio}% of revenue. `;
        
        if (expenseRatio > 80) {
            insights += 'Consider reducing operational costs.';
        } else if (expenseRatio < 40) {
            insights += 'You have good expense management.';
        }
        
        return insights;
    }

    sum(arr) {
        return arr.reduce((a, b) => a + b, 0);
    }

    async uploadToSupabase(userId, fileData) {
        try {
            const { data, error } = await supabase
                .from('file_uploads')
                .insert([{
                    user_id: userId,
                    file_name: fileData.fileName,
                    file_type: fileData.source,
                    extracted_data: fileData.data || fileData.structured,
                    created_at: new Date()
                }]);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Upload to Supabase error:', error);
            throw error;
        }
    }
}

// Initialize global synthesizer instance
let dataSynthesizer = new DataSynthesizer();

// Setup file upload handler in HTML
function setupFileUploadHandler() {
    const fileInput = document.getElementById('file-upload');
    const uploadStatus = document.getElementById('upload-status');
    
    if (!fileInput) return;
    
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        uploadStatus.textContent = 'Processing file...';
        
        try {
            const result = await dataSynthesizer.handleFileUpload(file);
            uploadStatus.textContent = '✓ File processed successfully!';
            
            // Display extracted data
            if (result.sheets) {
                console.log('Excel data:', result);
            } else if (result.structured) {
                console.log('PDF financial data:', result.structured);
            }
            
            // Upload to Supabase if user is logged in
            if (currentUser) {
                await dataSynthesizer.uploadToSupabase(currentUser.id, dataSynthesizer.extractedData);
                uploadStatus.textContent = '✓ File saved to your account!';
            }
        } catch (error) {
            uploadStatus.textContent = `✗ Error: ${error.message}`;
        }
    });
}

// PDF.js and XLSX libraries should be loaded in HTML
// <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js"></script>
