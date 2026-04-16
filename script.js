// Define all roll numbers with actual student data
const allRollNumbers = [];
// Add roll numbers from 127 to 189, excluding 146
for (let i = 127; i <= 189; i++) {
    if (i !== 146) {
        allRollNumbers.push(i);
    }
}

// Add additional roll numbers
allRollNumbers.push(302, 304);

// Sort the array
allRollNumbers.sort((a, b) => a - b);

// Student names mapping
const studentNames = {
    127: "MANSSHA YONAH A",
    128: "MATHAN S",
    129: "MEGAVARDHINI S",
    130: "MINU D",
    131: "MITHUN SARAVANAN",
    132: "MITHUNA SREE R S",
    133: "MOHAMMED FARDEEN M",
    134: "MOHAMMED IRFAN J",
    135: "MOTHESH S",
    136: "MOUNIGA G",
    137: "MUHAMMAD ASRAF",
    138: "MUKESH KUMAR N",
    139: "MUTHURAJ R",
    140: "MYTHEESH M",
    141: "NADEESH KUMAR N",
    142: "NAKUL M",
    143: "NANDHINI M",
    144: "NARESH R",
    145: "NAVASRI",
    147: "NIKESH K",
    148: "NISHANTH AMUTHAN V",
    149: "NISHANTHINI G K",
    150: "NITHIESH S",
    151: "NITHISH P",
    152: "NITHYASRI R",
    153: "NIVASH S",
    154: "PON SANMUGA VISHAL G",
    155: "PONRASU P",
    156: "POOVENTHAN K",
    157: "PRADEEBA B",
    158: "PRANAV K P",
    159: "PRATHEESH D",
    160: "PRATHIBA S",
    161: "PRAVEENA C",
    162: "PRAVIN SRIDHAR S",
    163: "PREETHI M",
    164: "PREETHIKA P E",
    165: "PRIYADHARSHINI S",
    166: "PRIYANGA DEVI R",
    167: "PRIYANKA S",
    168: "RAHUL J C",
    169: "RAHUL K",
    170: "RAJESHWARI E",
    171: "RAJESWARI G",
    172: "RAMANAN K",
    173: "RANJITH KUMAR R",
    174: "RAVINDRA A",
    175: "RITHANYA J",
    176: "RITHIKA S",
    177: "ROHINI G",
    178: "SABARISH G",
    179: "SACHIN S",
    180: "SAHAYA ROJA S S",
    181: "SAMICKSA A M",
    182: "SANDHIYA R",
    183: "SANJAI C",
    184: "SANJAI M",
    185: "SANJAIKUMAR R",
    186: "SANJAY M",
    187: "SANJAY R",
    188: "SANJAY S",
    189: "SANJAY S",
    302: "NIVAS K",
    304: "SELVARAJ A"
};

// Track marked students
let markedStudents = new Set();

// Poll results from screenshots
let uploadedFiles = [];

// DOM Elements
const rollInput = document.getElementById('rollInput');
const markBtn = document.getElementById('markBtn');
const markedList = document.getElementById('markedList');
const notMarkedList = document.getElementById('notMarkedList');
const markedCount = document.getElementById('markedCount');
const notMarkedCount = document.getElementById('notMarkedCount');
const totalCount = document.getElementById('totalCount');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const notification = document.getElementById('notification');

// Poll checker elements
const screenshotInput = document.getElementById('screenshotInput');
const extractBtn = document.getElementById('extractBtn');
const uploadLabel = document.querySelector('.upload-label');
const ocrStatus = document.getElementById('ocrStatus');

// Initialize the page
function init() {
    updateDisplay();
    rollInput.focus();
    totalCount.textContent = allRollNumbers.length;
}

// Show notification
function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Update the display
function updateDisplay() {
    markedList.innerHTML = '';
    notMarkedList.innerHTML = '';
    
    const notMarkedStudents = allRollNumbers.filter(roll => !markedStudents.has(roll));
    
    // Display marked students
    const sortedMarked = Array.from(markedStudents).sort((a, b) => a - b);
    sortedMarked.forEach(roll => {
        const div = createStudentElement(roll, true);
        markedList.appendChild(div);
    });
    
    // Display not marked students
    notMarkedStudents.forEach(roll => {
        const div = createStudentElement(roll, false);
        notMarkedList.appendChild(div);
    });
    
    // Update counts
    markedCount.textContent = markedStudents.size;
    notMarkedCount.textContent = notMarkedStudents.length;
}

// Create student element
function createStudentElement(roll, isMarked) {
    const div = document.createElement('div');
    div.className = `student-item ${isMarked ? 'student-marked' : 'student-not-marked'}`;
    const name = studentNames[roll] || '';
    div.textContent = `${roll} - ${name}`;
    div.title = isMarked ? 'Click to unmark' : 'Click to mark';
    
    div.addEventListener('click', () => {
        toggleMark(roll);
    });
    
    return div;
}

// Toggle mark status
function toggleMark(roll) {
    if (markedStudents.has(roll)) {
        markedStudents.delete(roll);
        showNotification(`Roll ${roll} unmarked`, 'error');
    } else {
        markedStudents.add(roll);
        showNotification(`Roll ${roll} marked`, 'success');
    }
    updateDisplay();
}

// Handle manual roll number input
rollInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        markRoll();
    }
});

markBtn.addEventListener('click', markRoll);

function markRoll() {
    const roll = parseInt(rollInput.value);
    
    if (isNaN(roll)) {
        showNotification('Please enter a valid roll number', 'error');
        rollInput.value = '';
        return;
    }
    
    if (!allRollNumbers.includes(roll)) {
        showNotification('Roll number not found in the list', 'error');
        rollInput.value = '';
        return;
    }
    
    if (markedStudents.has(roll)) {
        showNotification(`Roll ${roll} is already marked`, 'info');
    } else {
        markedStudents.add(roll);
        const name = studentNames[roll] || '';
        showNotification(`Roll ${roll} - ${name} marked`, 'success');
        updateDisplay();
    }
    
    rollInput.value = '';
    rollInput.focus();
}

// Reset all marks
resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all marks?')) {
        markedStudents.clear();
        updateDisplay();
        showNotification('All marks reset successfully', 'info');
        rollInput.focus();
    }
});

// Export poll report
exportBtn.addEventListener('click', () => {
    const date = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    const sortedMarked = Array.from(markedStudents).sort((a, b) => a - b);
    const notMarkedStudents = allRollNumbers.filter(roll => !markedStudents.has(roll));
    
    let report = `POLL CHECKER REPORT\n`;
    report += `Date: ${date}\n`;
    report += `================================\n\n`;
    report += `SUMMARY\n`;
    report += `-------\n`;
    report += `Total: ${allRollNumbers.length}\n`;
    report += `Marked: ${markedStudents.size}\n`;
    report += `Not Marked: ${notMarkedStudents.length}\n`;
    report += `Percentage: ${((markedStudents.size / allRollNumbers.length) * 100).toFixed(1)}%\n\n`;
    report += `MARKED (${sortedMarked.length})\n`;
    report += `------------------\n`;
    report += sortedMarked.join(', ') || 'None';
    report += `\n\nNOT MARKED (${notMarkedStudents.length})\n`;
    report += `-----------------\n`;
    report += notMarkedStudents.join(', ') || 'None';
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poll_report_${date.replace(/\//g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Report exported successfully', 'success');
});

// ===== SCREENSHOT EXTRACTION =====

// Handle file input
screenshotInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        uploadedFiles = [...uploadedFiles, ...files];
        extractBtn.disabled = false;
        updateUploadLabel();
        showNotification(`${files.length} image(s) selected (Total: ${uploadedFiles.length})`, 'info');
    }
});

// Handle drag and drop
uploadLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadLabel.style.borderColor = '#764ba2';
    uploadLabel.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)';
});

uploadLabel.addEventListener('dragleave', () => {
    uploadLabel.style.borderColor = '#667eea';
    uploadLabel.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)';
});

uploadLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadLabel.style.borderColor = '#667eea';
    uploadLabel.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)';
    
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
        uploadedFiles = [...uploadedFiles, ...files];
        extractBtn.disabled = false;
        updateUploadLabel();
        showNotification(`${files.length} image(s) added (Total: ${uploadedFiles.length})`, 'info');
    }
});

function updateUploadLabel() {
    uploadLabel.textContent = `📸 ${uploadedFiles.length} image(s) selected`;
}

function setOcrStatus(message = '') {
    ocrStatus.textContent = message;
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsDataURL(file);
    });
}

// Extract roll numbers from screenshots
extractBtn.addEventListener('click', async () => {
    if (uploadedFiles.length === 0) {
        showNotification('Please select images first', 'error');
        return;
    }
    
    extractBtn.disabled = true;
    extractBtn.textContent = 'Processing...';
    setOcrStatus(`Starting OCR for ${uploadedFiles.length} image(s)...`);
    
    let totalExtracted = new Set();
    
    try {
        const totalFiles = uploadedFiles.length;
        let processedFiles = 0;

        for (const file of uploadedFiles) {
            try {
                const imageData = await readFileAsDataURL(file);
                setOcrStatus(`Processing ${processedFiles + 1}/${totalFiles}: ${file.name}`);
                const result = await Tesseract.recognize(imageData, 'eng', {
                    logger: m => {
                        if (typeof m.progress === 'number') {
                            const percent = Math.round(m.progress * 100);
                            setOcrStatus(`Processing ${processedFiles + 1}/${totalFiles}: ${file.name} (${percent}%)`);
                        }
                    }
                });

                const text = result.data.text;
                const extractedRolls = extractRollNumbers(text);

                extractedRolls.forEach(roll => {
                    markedStudents.add(roll);
                    totalExtracted.add(roll);
                });

                if (extractedRolls.length > 0) {
                    showNotification(`Extracted ${extractedRolls.length} roll(s) from ${file.name}`, 'success');
                } else {
                    showNotification(`No valid roll found in ${file.name}`, 'info');
                }
            } catch (err) {
                console.error('OCR Error:', err);
                showNotification(`Error processing ${file.name}`, 'error');
            } finally {
                processedFiles += 1;
            }
        }

        uploadedFiles = [];
        screenshotInput.value = '';
        extractBtn.disabled = true;
        extractBtn.textContent = 'Extract from Screenshot';
        uploadLabel.textContent = '📸 Upload poll screenshot or mark manually';
        updateDisplay();
        setOcrStatus(`Done. Processed ${processedFiles}/${totalFiles} image(s).`);
        showNotification(`Total newly marked from upload: ${totalExtracted.size}`, 'success');
        
    } catch (err) {
        showNotification(`Error: ${err.message}`, 'error');
        extractBtn.disabled = false;
        extractBtn.textContent = 'Extract from Screenshot';
        setOcrStatus('Extraction stopped due to an unexpected error.');
    }
});

// Extract roll numbers from OCR text
function extractRollNumbers(text) {
    const lines = text.split('\n');
    const rolls = new Set();
    
    lines.forEach(line => {
        // Match only exact roll numbers to avoid partial matches.
        allRollNumbers.forEach(validRoll => {
            const pattern = new RegExp(`\\b${validRoll}\\b`);
            if (pattern.test(line)) {
                rolls.add(validRoll);
            }
        });
    });
    
    return Array.from(rolls).sort((a, b) => a - b);
}

// Initialize on page load
init();
