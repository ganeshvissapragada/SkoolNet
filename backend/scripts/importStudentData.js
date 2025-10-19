const { sequelize, User, Student, Class } = require('../models/postgres');
const bcrypt = require('bcryptjs');

const studentData = [
    // Class VI-A
    { class: 'VI', section: 'A', name: 'ARIGELA KANTHI MAI', gender: 'Female', fatherName: 'ANAND BABU', motherName: 'MANJU' },
    { class: 'VI', section: 'A', name: 'BOLLAM KALYANI', gender: 'Female', fatherName: 'SRINU', motherName: 'KUMARI' },
    { class: 'VI', section: 'A', name: 'ELLE HARSHINHI', gender: 'Female', fatherName: 'CHIRANJEEVI', motherName: 'SUJATHA' },
    { class: 'VI', section: 'A', name: 'KAYALA MALLIKARJUN', gender: 'Male', fatherName: 'RAMU', motherName: 'SRIDEVI' },
    { class: 'VI', section: 'A', name: 'NAKKA GOWTHAM', gender: 'Male', fatherName: 'NARSIMHULU', motherName: 'BHAGYAVATHI' },
    { class: 'VI', section: 'A', name: 'PENUMALA SATHWIK', gender: 'Male', fatherName: 'CHANTI', motherName: 'MALLESWARI' },
    { class: 'VI', section: 'A', name: 'RAYALA JASWANTH', gender: 'Male', fatherName: 'SURESH SRINIVAS', motherName: 'SWAPNA' },
    { class: 'VI', section: 'A', name: 'SETTI VAISHNAVI', gender: 'Female', fatherName: 'SRINU', motherName: 'MANGA DEVI' },
    { class: 'VI', section: 'A', name: 'UBA DILEEP', gender: 'Male', fatherName: 'SUDHAKAR RAO', motherName: 'DURGA' },
    { class: 'VI', section: 'A', name: 'VELDURTHI DEEKSHITHA', gender: 'Female', fatherName: 'MAHA LAKSHMI NARAYANA', motherName: 'DHANA LAKSHMI' },
    { class: 'VI', section: 'A', name: 'VELUDURTHY BHASKAR', gender: 'Male', fatherName: 'SUBRAMANYAM', motherName: 'LAKSHMI NAGA DURGA' },
    
    // Class VII-A
    { class: 'VII', section: 'A', name: 'ELLE RAMYA', gender: 'Female', fatherName: 'BALAKRISHNA', motherName: 'KUMARI' },
    { class: 'VII', section: 'A', name: 'KAPPALA SANDEEP', gender: 'Male', fatherName: 'CHIRANJEEVI', motherName: 'RAJYA LAKSHMI' },
    { class: 'VII', section: 'A', name: 'KARINKI GUNA SRI LAKSHMI VISHNAVI', gender: 'Female', fatherName: 'KARINKI LAKSHMANA RAO', motherName: 'KARINKI SATYAVATHI' },
    { class: 'VII', section: 'A', name: 'KASANI NAVYA CHANDANA', gender: 'Female', fatherName: 'GANGARAJU', motherName: 'JAYANTHI' },
    { class: 'VII', section: 'A', name: 'KOLLAPU LAHARI', gender: 'Female', fatherName: 'KOLLAPU VENKATAPATHI', motherName: 'VARALAKSHMI' },
    { class: 'VII', section: 'A', name: 'KOYYA LIKHITA', gender: 'Female', fatherName: 'VENKATARAO', motherName: 'RIBKA' },
    { class: 'VII', section: 'A', name: 'MIDDE LEELA LOKESH', gender: 'Male', fatherName: 'RAMU', motherName: 'MAHA LAKSHMI' },
    { class: 'VII', section: 'A', name: 'MIDDE VENKATA RAMANA', gender: 'Male', fatherName: 'DANAYYA', motherName: 'NAGAMANI' },
    { class: 'VII', section: 'A', name: 'PATHURI MERCY', gender: 'Female', fatherName: 'PATHURI SRINU', motherName: 'KANAKADURGA' },
    { class: 'VII', section: 'A', name: 'PULLURI HEMA SRI', gender: 'Female', fatherName: 'BAPANAYYA', motherName: 'NAGALAKSHMI' },
    { class: 'VII', section: 'A', name: 'RELANGI BHAVIJHNA', gender: 'Female', fatherName: 'PRASAD', motherName: 'MARIYAMMA' },
    { class: 'VII', section: 'A', name: 'RUTTULA BABY SRI SRUTHI', gender: 'Female', fatherName: 'NAGESWARA RAO', motherName: 'DHANALAKSHMI' },
    { class: 'VII', section: 'A', name: 'UBA JEEVAN KUMAR', gender: 'Male', fatherName: 'YESURATNAM', motherName: 'SURYAKALA' },
    { class: 'VII', section: 'A', name: 'UPPULURI MOULITHA SIRI', gender: 'Female', fatherName: 'UPPULURI KUMAR', motherName: 'UPPULURI MADHURI' },
    { class: 'VII', section: 'A', name: 'VEERAMALLU VIJAYA KUMAR', gender: 'Male', fatherName: 'VEERAMALLU VENKATESWARAO', motherName: 'VEERAMALLU SATYAVATHI' },
    { class: 'VII', section: 'A', name: 'VELDURTHI SINDHURA', gender: 'Female', fatherName: 'SUBRAHMANYAM', motherName: 'VENKATARAMANA' },

    // Class VIII-A
    { class: 'VIII', section: 'A', name: 'AKKABATTULA ADARSH', gender: 'Male', fatherName: 'VEERESH', motherName: 'ASHA' },
    { class: 'VIII', section: 'A', name: 'ANNADEVARA SRI VENKATA TEJA SATYA SANDEEP', gender: 'Male', fatherName: 'ADINARAYANA', motherName: 'RATNAKUMARI' },
    { class: 'VIII', section: 'A', name: 'CHIKATLA JAYA SURYA', gender: 'Male', fatherName: 'POSIRAJU', motherName: 'LAKSHMI NAGA DURGA' },
    { class: 'VIII', section: 'A', name: 'CHUKKA RATNA PRIYA', gender: 'Female', fatherName: 'TATARAO', motherName: 'SWARNA' },
    { class: 'VIII', section: 'A', name: 'GORRE RITHISH KUMAR', gender: 'Male', fatherName: 'SATISH KUMAR', motherName: 'KUMARI' },
    { class: 'VIII', section: 'A', name: 'KARINKI AJAY', gender: 'Male', fatherName: 'VEERA VENKATA SATYANARAYANA', motherName: 'PEDDINTLU' },
    { class: 'VIII', section: 'A', name: 'KARINKI AKSHITHA', gender: 'Female', fatherName: 'VEERA VENKATA SATYANARAYANA', motherName: 'PEDDINTLU' },
    { class: 'VIII', section: 'A', name: 'KARINKI NAGA SAI MANIKANTA', gender: 'Male', fatherName: 'RAMANJANEYULU', motherName: 'NAGALAKSHMI' },
    { class: 'VIII', section: 'A', name: 'KARINKI YAMINI SRI DURGA', gender: 'Female', fatherName: 'KARINKI LAKSHMANARAO', motherName: 'KARINKI SATYAVATHI' },
    { class: 'VIII', section: 'A', name: 'KAYALA VENKATA SATYA SAI NAGA MANI SHANKAR', gender: 'Male', fatherName: 'DHARMA RAJU', motherName: 'BHU LAKSHMI' },
    { class: 'VIII', section: 'A', name: 'KOLLI BULYA RANI', gender: 'Female', fatherName: 'KOLLI VENKANNA', motherName: 'KOLLI VANI' },
    { class: 'VIII', section: 'A', name: 'KOMALA MANJU SRI', gender: 'Female', fatherName: 'SATISH', motherName: 'VIJAYA LAXMI' },
    { class: 'VIII', section: 'A', name: 'KOYYA LAKUDU', gender: 'Male', fatherName: 'VENKATRAO', motherName: 'RIBKA' },
    { class: 'VIII', section: 'A', name: 'MIDDE JAYA SRI', gender: 'Female', fatherName: 'SRINU', motherName: 'ANANTHALAKSHMI' },
    { class: 'VIII', section: 'A', name: 'MIDDE VAMSI', gender: 'Male', fatherName: 'VENKATESWARA RAO', motherName: 'SATYAVATHI' },
    { class: 'VIII', section: 'A', name: 'MUPPIDI MAHALAKSHMI', gender: 'Female', fatherName: 'VENKATESULU', motherName: 'ANJAMMA' },
    { class: 'VIII', section: 'A', name: 'SETTI LAHARI', gender: 'Female', fatherName: 'SRINU', motherName: 'MANGADEVI' },
    { class: 'VIII', section: 'A', name: 'SHAIK SAMEER', gender: 'Male', fatherName: 'VALI SAHEB', motherName: 'MUNNISHA BEGUM' },
    { class: 'VIII', section: 'A', name: 'UPPULURI SATYA SWARUP', gender: 'Male', fatherName: 'VERA VENKATA DURGA RAO', motherName: 'KASI ANNAPURNA' },
    { class: 'VIII', section: 'A', name: 'VANDE SUMANTH', gender: 'Male', fatherName: 'AMRUTHA RAO', motherName: 'SANDHYA' },
    { class: 'VIII', section: 'A', name: 'VELDURTHI AMRUTHA DURGA', gender: 'Female', fatherName: 'MAHALAKSHMI NARAYANA', motherName: 'DHANA LAKSHMI' },

    // Class IX-A
    { class: 'IX', section: 'A', name: 'AKKABATTULA SARANYA', gender: 'Female', fatherName: 'PRAKASAM', motherName: 'SUKANYA' },
    { class: 'IX', section: 'A', name: 'AMBATI VINEETHA', gender: 'Female', fatherName: 'MANGA RAJU', motherName: 'MERY' },
    { class: 'IX', section: 'A', name: 'ARIGELA PRAVALIKA', gender: 'Female', fatherName: 'RAMESH', motherName: 'POCHAMMA' },
    { class: 'IX', section: 'A', name: 'CHEMPATI SAI', gender: 'Male', fatherName: 'VENKATA SUBBARAJU', motherName: 'VEERALAKSHMI' },
    { class: 'IX', section: 'A', name: 'GORRE JESSY', gender: 'Female', fatherName: 'GANGAYYA', motherName: 'KALYANI' },
    { class: 'IX', section: 'A', name: 'KAPPALA SLAISI', gender: 'Female', fatherName: 'CHIRANJEEVI', motherName: 'RAJYA LAKSHMI' },
    { class: 'IX', section: 'A', name: 'KARINKI NARESH', gender: 'Male', fatherName: 'PATIYYA', motherName: 'NAGALAKSHMI' },
    { class: 'IX', section: 'A', name: 'KAYALA SATYANARAYANA', gender: 'Male', fatherName: 'RAMU', motherName: 'SRIDEVI' },
    { class: 'IX', section: 'A', name: 'KOLLI NITHISH', gender: 'Male', fatherName: 'PRAKASA RAO', motherName: 'PADMA' },
    { class: 'IX', section: 'A', name: 'KOLLI PALLAVI', gender: 'Female', fatherName: 'VENKANNA', motherName: 'VANI' },
    { class: 'IX', section: 'A', name: 'KOMALA RAMYA SRI', gender: 'Female', fatherName: 'SATISH', motherName: 'VIJAYA LAXMI' },
    { class: 'IX', section: 'A', name: 'KONDETI SUHAS', gender: 'Male', fatherName: 'GANGARAJU', motherName: 'LAKSHMI' },
    { class: 'IX', section: 'A', name: 'MARISETTI DURGA SRI NAGA ESWAR', gender: 'Male', fatherName: 'VENKATARAO', motherName: 'NAGA JYOTHI' },
    { class: 'IX', section: 'A', name: 'MIDDE DEVI DURGA', gender: 'Female', fatherName: 'DANAYYA', motherName: 'NAGAMANI' },
    { class: 'IX', section: 'A', name: 'MUPPIDI ABHINAYA', gender: 'Female', fatherName: 'VENKATESULU', motherName: 'ANJAMMA' },
    { class: 'IX', section: 'A', name: 'MUPPIDI ANUSHA', gender: 'Female', fatherName: 'RAJU', motherName: 'VEERA VENI' },
    { class: 'IX', section: 'A', name: 'NAMBURI MRUNAL', gender: 'Male', fatherName: 'SAI KRISHNA', motherName: 'SATYAVATHI' },
    { class: 'IX', section: 'A', name: 'NICHENAKOLA TEJASWINI', gender: 'Female', fatherName: 'SATYANARAYANA', motherName: 'VENKATA NARSAMMA' },
    { class: 'IX', section: 'A', name: 'PUCHHAKAYALA ABHI', gender: 'Male', fatherName: 'DHARMAYYA', motherName: 'PADMA' },
    { class: 'IX', section: 'A', name: 'SHAIK DURGA', gender: 'Female', fatherName: 'POSIYYA', motherName: 'BEGUM' },
    { class: 'IX', section: 'A', name: 'UPPULURI AKANKSHA LAKSHMI', gender: 'Female', fatherName: 'NAGA SATYANARAYANA MURTHY', motherName: 'ANANTHALAKSHMI' },
    { class: 'IX', section: 'A', name: 'VAKA PADMA', gender: 'Female', fatherName: 'DURGARAO', motherName: 'SYAMALA' },
    { class: 'IX', section: 'A', name: 'VAKA PRAMEELA', gender: 'Female', fatherName: 'VENKANNA', motherName: 'BHARATHA LAKSHMI' },
    { class: 'IX', section: 'A', name: 'VELDURTHI NAGA VENKATA GANESH', gender: 'Male', fatherName: 'RAJU', motherName: 'MADHAVI' },
    { class: 'IX', section: 'A', name: 'VELDURTHI PRIYADARSHINI', gender: 'Female', fatherName: 'SUBRAHMANYAM', motherName: 'VENKATA RAMANA' },
    { class: 'IX', section: 'A', name: 'VELUDURTHY SRAVANI', gender: 'Female', fatherName: 'SUBRAHMANYAM', motherName: 'LAKSHMI NAGA DURGA' },
    { class: 'IX', section: 'A', name: 'YALLA PRAMODH KUMAR', gender: 'Male', fatherName: 'GANGADHARA RAO', motherName: 'JYOTHI' },

    // Class X-A
    { class: 'X', section: 'A', name: 'ANNADEVARA PRATIPA SRI', gender: 'Female', fatherName: 'ADINARAYANA', motherName: 'RATNA KUMARI' },
    { class: 'X', section: 'A', name: 'BANDARU DURGA PRASAD', gender: 'Male', fatherName: 'GANGA RAJU', motherName: 'SATYAVATHI' },
    { class: 'X', section: 'A', name: 'ELLE NAVYA', gender: 'Female', fatherName: 'SIVAPRASAD', motherName: 'DEVI' },
    { class: 'X', section: 'A', name: 'ENJE SRIVALLI', gender: 'Female', fatherName: 'RAJESH', motherName: 'DIVYA' },
    { class: 'X', section: 'A', name: 'KASANI VINAY VENKATA KRISHNA', gender: 'Male', fatherName: 'SURESH', motherName: 'MAHALAKSHMI' },
    { class: 'X', section: 'A', name: 'KAYALA VARSHINI', gender: 'Female', fatherName: 'DANAYYA', motherName: 'SUJATHA' },
    { class: 'X', section: 'A', name: 'KOMALA ANJANEYULU', gender: 'Male', fatherName: 'VENKATESWA RAO', motherName: 'VENKATA LAKSHMI' },
    { class: 'X', section: 'A', name: 'KOMATI LAKSHMAN', gender: 'Male', fatherName: 'PRASAD', motherName: 'SUJATHA' },
    { class: 'X', section: 'A', name: 'MARIDU GAGANA', gender: 'Female', fatherName: 'VENKATA KRISHNA', motherName: 'SATYAVENI' },
    { class: 'X', section: 'A', name: 'MARISETTI RAMBABU', gender: 'Male', fatherName: 'VENKATARAO', motherName: 'NAGA JYOTHI' },
    { class: 'X', section: 'A', name: 'MIDDE RAMYA', gender: 'Female', fatherName: 'RAMBABU', motherName: 'RAMALAKSHMI' },
    { class: 'X', section: 'A', name: 'MIDDE SUBRAHMANYAM', gender: 'Male', fatherName: 'VENKATESWARARAO', motherName: 'SATYAVATHI' },
    { class: 'X', section: 'A', name: 'MUPPIDI LOKESH', gender: 'Male', fatherName: 'RAJU', motherName: 'VEERA VENI' },
    { class: 'X', section: 'A', name: 'PARLA ANUSHA', gender: 'Female', fatherName: 'RAVI', motherName: 'DHANALAKSHMI' },
    { class: 'X', section: 'A', name: 'PARLA SUBASHINI', gender: 'Female', fatherName: 'SRINU', motherName: 'MARIYAMMA' },
    { class: 'X', section: 'A', name: 'PATURI VAMSI', gender: 'Male', fatherName: 'RAJU', motherName: 'DIVYA' },
    { class: 'X', section: 'A', name: 'POLUMURI PRANEETH', gender: 'Male', fatherName: 'DURGARAO', motherName: 'PADMA' },
    { class: 'X', section: 'A', name: 'PRATTIPATI DHANA VARSHITHA', gender: 'Female', fatherName: 'VENKATESWARLU', motherName: 'VENKATALAKSHMI' },
    { class: 'X', section: 'A', name: 'RELANGI INDUMANI', gender: 'Female', fatherName: 'BABU', motherName: 'VARALAKSHMI' },
    { class: 'X', section: 'A', name: 'RELANGI YUGA VENKATA KRISHNA SATYA PHANINDRA', gender: 'Male', fatherName: 'BABU', motherName: 'VARALAKSHMI' },
    { class: 'X', section: 'A', name: 'SHAIK AMMAJI', gender: 'Female', fatherName: 'POSIYYA', motherName: 'BEGUM' },
    { class: 'X', section: 'A', name: 'UBA AKHILA', gender: 'Female', fatherName: 'SANTHOSHAM', motherName: 'VIJAYA LAKSHMI' },
    { class: 'X', section: 'A', name: 'VAKA DIVYA', gender: 'Female', fatherName: 'NAGARAJU', motherName: 'MANGA' },
    { class: 'X', section: 'A', name: 'VANDE PRAVALLIKA', gender: 'Female', fatherName: 'RAVI', motherName: 'JAYAMANI' },
    { class: 'X', section: 'A', name: 'VELPURI VEERA MANIKANTA', gender: 'Male', fatherName: 'SRINU', motherName: 'SATYAVATHI' }
];

async function generateUsername(name) {
    // Convert to lowercase, replace spaces with dots, and remove special characters
    const username = name.toLowerCase()
        .replace(/\s+/g, '.')
        .replace(/[^a-z0-9.]/g, '');
    
    // Add a random number if needed to make it unique
    const randomNum = Math.floor(Math.random() * 100);
    return `${username}${randomNum}`;
}

async function generatePassword() {
    // Generate a random 8-character password
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

async function createUser(name, role, email) {
    const password = await generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    });

    return { user, plainPassword: password };
}

async function generateEmail(name, role, attempt = 0) {
    // Convert to lowercase, replace spaces with dots, remove special characters
    const cleanName = name.toLowerCase()
        .replace(/\s+/g, '.')
        .replace(/[^a-z0-9.]/g, '');
    
    // Add timestamp and random number to ensure uniqueness
    const timestamp = Date.now().toString(36);
    const randomNum = Math.floor(Math.random() * 1000);
    const email = `${cleanName}.${timestamp}${randomNum}@school.com`;

    try {
        // Check if email exists
        const existing = await User.findOne({ where: { email } });
        if (existing && attempt < 3) {
            // Try again with a different random number
            return generateEmail(name, role, attempt + 1);
        }
    } catch (error) {
        console.error('Error checking email existence:', error);
    }

    return email;
}

async function importData() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');

        const credentials = [];
        const parentUsers = new Map(); // Store parent users by name

        // Start a single transaction for all operations
        await sequelize.transaction(async (t) => {
            // First pass: Create parent accounts
            console.log('Creating parent accounts...');
            for (const data of studentData) {
                if (!parentUsers.has(data.fatherName)) {
                    try {
                        const fatherEmail = await generateEmail(data.fatherName, 'parent');
                        const { user: fatherUser, plainPassword: fatherPassword } = await createUser(data.fatherName, 'parent', fatherEmail);
                        parentUsers.set(data.fatherName, { user: fatherUser, password: fatherPassword });
                        console.log(`Created parent account: ${data.fatherName}`);
                    } catch (error) {
                        console.error(`Error creating parent account for ${data.fatherName}:`, error.message);
                    }
                }
            }

            // Second pass: Create student accounts and link to parents
            console.log('\nCreating student accounts...');
            for (const data of studentData) {
                try {
                    // Get parent info
                    const parentInfo = parentUsers.get(data.fatherName);
                    if (!parentInfo) {
                        throw new Error(`Parent account not found for ${data.fatherName}`);
                    }

                    // Create student user
                    const studentEmail = await generateEmail(data.name, 'student');

                    const { user: studentUser, plainPassword: studentPassword } = await createUser(data.name, 'student', studentEmail);

                    // Create student record
                    const student = await Student.create({
                        name: data.name,
                        class: data.class,
                        section: data.section,
                        user_id: studentUser.id,
                        parent_id: parentInfo.user.id
                    }, { transaction: t });

                    // Store credentials for later output
                    credentials.push({
                        student: { name: data.name, email: studentEmail, password: studentPassword },
                        father: { name: data.fatherName, email: parentInfo.user.email, password: parentInfo.password }
                    });

                    console.log(`Created student: ${data.name}`);
                } catch (error) {
                    console.error(`Error processing student ${data.name}:`, error.message);
                }
            }
        });

        // Save all credentials to a file
        const credentialsOutput = credentials.map(cred => 
            `Student: ${cred.student.name}
            Email: ${cred.student.email}
            Password: ${cred.student.password}
            
            Parent: ${cred.father.name}
            Email: ${cred.father.email}
            Password: ${cred.father.password}
            ----------------------------------------`
        ).join('\n');

        fs.writeFileSync('credentials.txt', credentialsOutput);
        console.log('Credentials have been saved to credentials.txt');

        console.log('Data import completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
}

importData();
