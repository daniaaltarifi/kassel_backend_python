const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const sendMessage = async (req, res) => {
    const { phone, message } = req.body; 
    const imageFiles = req.files?.imageFile ? req.files.imageFile : [];

    const phoneNumbers = phone.split(',').map(num => num.trim());

    fs.writeFileSync('phone_numbers.txt', phoneNumbers.join('\n'));
    fs.writeFileSync('message.txt', message);
    
    if (imageFiles.length > 0) {
        // Store full image paths
        const imageNames = imageFiles.map(file => 
            path.join('C:\\Users\\Admin\\Desktop\\kasselsoft_backend\\images', file.originalname)
        ); 
        fs.writeFileSync('images.txt', imageNames.join('\n'));
    } else {
        fs.writeFileSync('images.txt', '');
    }

    const scriptPath = path.join(__dirname, 'send.py'); 
    const pythonPath = 'C:\\Users\\Admin\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';

    exec(`${pythonPath} "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error sending message');
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send('Message sent successfully');
    });
};





// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');
// const dotenv=require('dotenv')
// dotenv.config();

// const sendMessage = async (req, res) => {
//     const { phone, message } = req.body;
//     const imageFiles = req.files?.imageFile ? req.files.imageFile : [];

//     const phoneNumbers = phone.split(',').map(num => num.trim());

//     fs.writeFileSync('phone_numbers.txt', phoneNumbers.join('\n'));
//     fs.writeFileSync('message.txt', message);

//     if (imageFiles.length > 0) {
//         const imageDir = path.join(__dirname, '..', 'images'); // This assumes images are directly under kasselbackend


//         const imageNames = imageFiles.map(file =>
//             path.join(imageDir, file.originalname)
//         );
//         fs.writeFileSync('images.txt', imageNames.join('\n'));
//     } else {
//         fs.writeFileSync('images.txt', '');
//     }

//     const scriptPath = path.join(__dirname, 'send.py');
//     const pythonPath = '/root/myenv/bin/python3'; // Adjust this path if needed
// //    const pythonPath = 'C:\\Users\\Admin\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';

//     // Set the DISPLAY environment variable
//         process.env.DISPLAY = process.env.DISPLAY || ':99';


//           exec(`${pythonPath} "${scriptPath}"`, (error, stdout, stderr) => {


//         if (error) {
//             console.error(`exec error: ${error}`);
//             return res.status(500).send(`Error sending message: ${error.message}`);
//         }
//         console.log(`stdout: ${stdout}`);
//         console.log(`stderr: ${stderr}`);
//         res.send(`Message sent successfully stdout: ${stdout} stderr: ${stderr} `);

//     });
// };

































































// const sendMessage = async (req, res) => {
//     try {
//         const { message } = req.body; 
//         const phoneFile = req.files?.phoneFile; // Access the uploaded phone file
//         const phoneInput = req.body.phone; // Text input for phone numbers
//         let phoneNumbers = [];

//         // If an Excel file is uploaded
//         if (phoneFile && phoneFile.length > 0) {
//             // Ensure you're pointing to the correct 'images' folder
//             const phoneFilePath = path.join(__dirname, 'images', phoneFile[0].originalname);

//             // Use fs.promises.writeFile to save the uploaded file
//             await fs.promises.writeFile(phoneFilePath, phoneFile[0].buffer);

//             // Now read the uploaded Excel file
//             const workbook = xlsx.readFile(phoneFilePath);
//             const sheetName = workbook.SheetNames[0]; // Get the first sheet
//             const worksheet = workbook.Sheets[sheetName];
//             const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // Convert to JSON
            
//             // Assuming phone numbers are in the first column
//             phoneNumbers = data.map(row => row[0]).filter(num => num); // Extract numbers and filter out empty entries
//         } 
//         // If phone numbers are provided as text input
//         else if (phoneInput) {
//             phoneNumbers = phoneInput.split(',').map(num => num.trim()).filter(Boolean);
//         }

//         // Validate phone numbers
//         if (phoneNumbers.length === 0) {
//             return res.status(400).send('No valid phone numbers provided.');
//         }

//         // Validate message
//         if (!message) {
//             return res.status(400).send('Message cannot be empty.');
//         }

//         // Save phone numbers and message
//         fs.writeFileSync('phone_numbers.txt', phoneNumbers.join('\n'));
//         fs.writeFileSync('message.txt', message);

//         // Handle image files if any
//         const imageFiles = req.files?.imageFile || [];
//         if (imageFiles.length > 0) {
//             const imageNames = imageFiles.map(file => 
//                 path.join(__dirname, 'images', file.originalname)
//             ); 
//             fs.writeFileSync('images.txt', imageNames.join('\n'));
//         } else {
//             fs.writeFileSync('images.txt', '');
//         }

//         // Execute the Python script
//         const scriptPath = path.join(__dirname, 'send.py'); 
//         const pythonPath = 'C:\\Users\\Admin\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';

//         exec(`${pythonPath} "${scriptPath}"`, (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`exec error: ${error}`);
//                 return res.status(500).send('Error sending message');
//             }
//             console.log(`stdout: ${stdout}`);
//             console.log(`stderr: ${stderr}`);
//             res.send('Message sent successfully');
//         });
//     } catch (error) {
//         console.error(`Unexpected error: ${error}`);
//         res.status(500).send('Internal server error');
//     }
// };

// const sendMessage = async (req, res) => {
//     const { phone, message } = req.body; 
//     const imageFiles = req.files?.imageFile ? req.files.imageFile : [];

//     // Process phone numbers
//     const phoneNumbers = phone.split(',').map(num => num.trim());

//     // Define the file paths relative to the controller folder
//     const phoneFilePath = path.join(__dirname, 'phone_numbers.txt');
//     const messageFilePath = path.join(__dirname, 'message.txt');
//     const imagesFilePath = path.join(__dirname, 'images.txt');

//     // Write the phone numbers to the file
//     fs.writeFileSync(phoneFilePath, phoneNumbers.join('\n'));

//     // Update the message
//     fs.writeFileSync(messageFilePath, message);

//     // Initialize an array to store image file names
//     const savedImageNames = [];

//     // Write the images directly to the same directory and log their names
//     if (imageFiles.length > 0) {
//         for (const file of imageFiles) {
//             if (!file.name || !file.data) {
//                 console.error('File is missing name or data:', file);
//                 continue; // Skip this file if it’s not valid
//             }

//             const filePath = path.join(__dirname, file.name);
//             console.log('Saving file to:', filePath); // Debugging log

//             try {
//                 fs.writeFileSync(filePath, file.data); // Adjust this line based on how file data is handled
//                 savedImageNames.push(file.name); // Store the saved file name
//             } catch (err) {
//                 console.error('Error saving file:', err);
//             }
//         }
//     }

//     // Write the saved image names to images.txt
//     fs.writeFileSync(imagesFilePath, savedImageNames.join('\n'));

//     const scriptPath = path.join(__dirname, 'send.py'); 
//     const pythonPath = 'C:\\Users\\Admin\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';

//     exec(`${pythonPath} "${scriptPath}"`, (error, stdout, stderr) => {
//         if (error) {
//             console.error(`exec error: ${error}`);
//             return res.status(500).send('Error sending message');
//         }
//         console.log(`stdout: ${stdout}`);
//         console.log(`stderr: ${stderr}`);
//         res.send('Message sent successfully');
//     });
// };


// const sendMessage = async (req, res) => {
//     const { phone, message } = req.body; 
//     const imageFiles = req.files?.imageFile ? req.files.imageFile : [];

//     // Create an array of phone numbers from the input
//     const phoneNumbers = phone.split(',').map(num => num.trim());

//     // Define the paths for the text files in the current directory
//     const phoneFilePath = path.join(__dirname, 'phone_numbers.txt');
//     const messageFilePath = path.join(__dirname, 'message.txt');
//     const imageFilePath = path.join(__dirname, 'images.txt');

//     // Write phone numbers to file
//     fs.writeFileSync(phoneFilePath, phoneNumbers.join('\n'));
//     // Write message to file
//     fs.writeFileSync(messageFilePath, message);

//     // Write image paths to file if there are any images
//     if (imageFiles.length > 0) {
//         const imageNames = imageFiles.map(file => 
//             path.join('C:\\Users\\Admin\\Desktop\\kasselsoft_backend\\images', file.originalname)
//         ); 
//         fs.writeFileSync(imageFilePath, imageNames.join('\n'));
//     } else {
//         fs.writeFileSync(imageFilePath, ''); // Create an empty images.txt file if no images
//     }

//     // Path to the Python script
//     const scriptPath = path.join(__dirname, 'send.py'); 
//     const pythonPath = 'C:\\Users\\Admin\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';

//     // Execute the Python script
//     exec(`${pythonPath} "${scriptPath}"`, (error, stdout, stderr) => {
//         if (error) {
//             console.error(`exec error: ${error}`);
//             return res.status(500).send('Error sending message');
//         }
//         console.log(`stdout: ${stdout}`);
//         console.log(`stderr: ${stderr}`);
//         res.send('Message sent successfully');
//     });
// };








module.exports = { sendMessage };
