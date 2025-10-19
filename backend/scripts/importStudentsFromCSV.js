const fs = require('fs');
const bcrypt = require('bcryptjs');
const { sequelize, User, Student, Class } = require('../models/postgres');
const path = require('path');

// Function to generate a random password
const generatePassword = () => {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

// Function to generate a username from name
const generateUsername = (name) => {
    return name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
};

async function importStudentData(csvData) {
    const lines = csvData.trim().split('\n');
    // Remove header
    lines.shift();

    // Store credentials for later output
    const credentials = [];

    try {
        await sequelize.transaction(async (t) => {
            for (const line of lines) {
                const [className, section, name, gender, fatherName, motherName] = line.split(',').map(item => item.trim());

                // Find or create class
                const [classObj] = await Class.findOrCreate({
                    where: { 
                        name: className,
                        section: section
                    },
                    defaults: {
                        name: className,
                        section: section
                    },
                    transaction: t
                });

                // Generate credentials for parents
                const fatherUsername = generateUsername(fatherName);
                const motherUsername = generateUsername(motherName);
                const fatherPassword = generatePassword();
                const motherPassword = generatePassword();

                // Create father's account
                const fatherHash = await bcrypt.hash(fatherPassword, 10);
                const [father] = await User.findOrCreate({
                    where: { username: fatherUsername },
                    defaults: {
                        username: fatherUsername,
                        password: fatherHash,
                        role: 'parent',
                        name: fatherName,
                        gender: 'Male'
                    },
                    transaction: t
                });

                // Create mother's account
                const motherHash = await bcrypt.hash(motherPassword, 10);
                const [mother] = await User.findOrCreate({
                    where: { username: motherUsername },
                    defaults: {
                        username: motherUsername,
                        password: motherHash,
                        role: 'parent',
                        name: motherName,
                        gender: 'Female'
                    },
                    transaction: t
                });

                // Generate student credentials
                const studentUsername = generateUsername(name);
                const studentPassword = generatePassword();
                const studentHash = await bcrypt.hash(studentPassword, 10);

                // Create student account
                const [student] = await User.findOrCreate({
                    where: { username: studentUsername },
                    defaults: {
                        username: studentUsername,
                        password: studentHash,
                        role: 'student',
                        name: name,
                        gender: gender
                    },
                    transaction: t
                });

                // Create student record
                await Student.create({
                    userId: student.id,
                    classId: classObj.id,
                    fatherId: father.id,
                    motherId: mother.id
                }, { transaction: t });

                // Store credentials
                credentials.push({
                    student: { name, username: studentUsername, password: studentPassword },
                    father: { name: fatherName, username: fatherUsername, password: fatherPassword },
                    mother: { name: motherName, username: motherUsername, password: motherPassword }
                });
            }
        });

        // Save credentials to a file
        const credentialsOutput = credentials.map(cred => 
            `Student: ${cred.student.name}
            Username: ${cred.student.username}
            Password: ${cred.student.password}
            Father: ${cred.father.name}
            Username: ${cred.father.username}
            Password: ${cred.father.password}
            Mother: ${cred.mother.name}
            Username: ${cred.mother.username}
            Password: ${cred.mother.password}
            ----------------------------------------`
        ).join('\n');

        fs.writeFileSync(path.join(__dirname, 'credentials.txt'), credentialsOutput);
        console.log('Data import completed successfully!');
        console.log('Credentials have been saved to credentials.txt');

    } catch (error) {
        console.error('Error during import:', error);
        throw error;
    }
}

// Read the CSV data and run the import
const csvData = `Class,Section,Name,Gender,Father Name,Mother Name
VI,A,ARIGELA KANTHI MAI,Female,ANAND BABU,MANJU
VI,A,BOLLAM KALYANI,Female,SRINU,KUMARI
VI,A,ELLE HARSHINHI,Female,CHIRANJEEVI,SUJATHA
VI,A,KAYALA MALLIKARJUN,Male,RAMU,SRIDEVI
VI,A,NAKKA GOWTHAM,Male,NARSIMHULU,BHAGYAVATHI
VI,A,PENUMALA SATHWIK,Male,CHANTI,MALLESWARI
VI,A,RAYALA JASWANTH,Male,SURESH SRINIVAS,SWAPNA
VI,A,SETTI VAISHNAVI,Female,SRINU,MANGA DEVI
VI,A,UBA DILEEP,Male,SUDHAKAR RAO,DURGA
VI,A,VELDURTHI DEEKSHITHA,Female,MAHA LAKSHMI NARAYANA,DHANA LAKSHMI
VI,A,VELUDURTHY BHASKAR,Male,SUBRAMANYAM,LAKSHMI NAGA DURGA
VII,A,ELLE RAMYA,Female,BALAKRISHNA,KUMARI
VII,A,KAPPALA SANDEEP,Male,CHIRANJEEVI,RAJYA LAKSHMI
VII,A,KARINKI GUNA SRI LAKSHMI VISHNAVI,Female,KARINKI LAKSHMANA RAO,KARINKI SATYAVATHI
VII,A,KASANI NAVYA CHANDANA,Female,GANGARAJU,JAYANTHI
VII,A,KOLLAPU LAHARI,Female,KOLLAPU VENKATAPATHI,VARALAKSHMI
VII,A,KOYYA LIKHITA,Female,VENKATARAO,RIBKA
VII,A,MIDDE LEELA LOKESH,Male,RAMU,MAHA LAKSHMI
VII,A,MIDDE VENKATA RAMANA,Male,DANAYYA,NAGAMANI
VII,A,PATHURI MERCY,Female,PATHURI SRINU,KANAKADURGA
VII,A,PULLURI HEMA SRI,Female,BAPANAYYA,NAGALAKSHMI
VII,A,RELANGI BHAVIJHNA,Female,PRASAD,MARIYAMMA
VII,A,RUTTULA BABY SRI SRUTHI,Female,NAGESWARA RAO,DHANALAKSHMI
VII,A,UBA JEEVAN KUMAR,Male,YESURATNAM,SURYAKALA
VII,A,UPPULURI MOULITHA SIRI,Female,UPPULURI KUMAR,UPPULURI MADHURI
VII,A,VEERAMALLU VIJAYA KUMAR,Male,VEERAMALLU VENKATESWARAO,VEERAMALLU SATYAVATHI
VII,A,VELDURTHI SINDHURA,Female,SUBRAHMANYAM,VENKATARAMANA
VIII,A,AKKABATTULA ADARSH,Male,VEERESH,ASHA
VIII,A,ANNADEVARA SRI VENKATA TEJA SATYA SANDEEP,Male,ADINARAYANA,RATNAKUMARI
VIII,A,CHIKATLA JAYA SURYA,Male,POSIRAJU,LAKSHMI NAGA DURGA
VIII,A,CHUKKA RATNA PRIYA,Female,TATARAO,SWARNA
VIII,A,GORRE RITHISH KUMAR,Male,SATISH KUMAR,KUMARI
VIII,A,KARINKI AJAY,Male,VEERA VENKATA SATYANARAYANA,PEDDINTLU
VIII,A,KARINKI AKSHITHA,Female,VEERA VENKATA SATYANARAYANA,PEDDINTLU
VIII,A,KARINKI NAGA SAI MANIKANTA,Male,RAMANJANEYULU,NAGALAKSHMI
VIII,A,KARINKI YAMINI SRI DURGA,Female,KARINKI LAKSHMANARAO,KARINKI SATYAVATHI
VIII,A,KAYALA VENKATA SATYA SAI NAGA MANI SHANKAR,Male,DHARMA RAJU,BHU LAKSHMI
VIII,A,KOLLI BULYA RANI,Female,KOLLI VENKANNA,KOLLI VANI
VIII,A,KOMALA MANJU SRI,Female,SATISH,VIJAYA LAXMI
VIII,A,KOYYA LAKUDU,Male,VENKATRAO,RIBKA
VIII,A,MIDDE JAYA SRI,Female,SRINU,ANANTHALAKSHMI
VIII,A,MIDDE VAMSI,Male,VENKATESWARA RAO,SATYAVATHI
VIII,A,MUPPIDI MAHALAKSHMI,Female,VENKATESULU,ANJAMMA
VIII,A,SETTI LAHARI,Female,SRINU,MANGADEVI
VIII,A,SHAIK SAMEER,Male,VALI SAHEB,MUNNISHA BEGUM
VIII,A,UPPULURI SATYA SWARUP,Male,VERA VENKATA DURGA RAO,KASI ANNAPURNA
VIII,A,VANDE SUMANTH,Male,AMRUTHA RAO,SANDHYA
VIII,A,VELDURTHI AMRUTHA DURGA,Female,MAHALAKSHMI NARAYANA,DHANA LAKSHMI
IX,A,AKKABATTULA SARANYA,Female,PRAKASAM,SUKANYA
IX,A,AMBATI VINEETHA,Female,MANGA RAJU,MERY
IX,A,ARIGELA PRAVALIKA,Female,RAMESH,POCHAMMA
IX,A,CHEMPATI SAI,Male,VENKATA SUBBARAJU,VEERALAKSHMI
IX,A,GORRE JESSY,Female,GANGAYYA,KALYANI
IX,A,KAPPALA SLAISI,Female,CHIRANJEEVI,RAJYA LAKSHMI
IX,A,KARINKI NARESH,Male,PATIYYA,NAGALAKSHMI
IX,A,KAYALA SATYANARAYANA,Male,RAMU,SRIDEVI
IX,A,KOLLI NITHISH,Male,PRAKASA RAO,PADMA
IX,A,KOLLI PALLAVI,Female,VENKANNA,VANI
IX,A,KOMALA RAMYA SRI,Female,SATISH,VIJAYA LAXMI
IX,A,KONDETI SUHAS,Male,GANGARAJU,LAKSHMI
IX,A,MARISETTI DURGA SRI NAGA ESWAR,Male,VENKATARAO,NAGA JYOTHI
IX,A,MIDDE DEVI DURGA,Female,DANAYYA,NAGAMANI
IX,A,MUPPIDI ABHINAYA,Female,VENKATESULU,ANJAMMA
IX,A,MUPPIDI ANUSHA,Female,RAJU,VEERA VENI
IX,A,NAMBURI MRUNAL,Male,SAI KRISHNA,SATYAVATHI
IX,A,NICHENAKOLA TEJASWINI,Female,SATYANARAYANA,VENKATA NARSAMMA
IX,A,PUCHHAKAYALA ABHI,Male,DHARMAYYA,PADMA
IX,A,SHAIK DURGA,Female,POSIYYA,BEGUM
IX,A,UPPULURI AKANKSHA LAKSHMI,Female,NAGA SATYANARAYANA MURTHY,ANANTHALAKSHMI
IX,A,VAKA PADMA,Female,DURGARAO,SYAMALA
IX,A,VAKA PRAMEELA,Female,VENKANNA,BHARATHA LAKSHMI
IX,A,VELDURTHI NAGA VENKATA GANESH,Male,RAJU,MADHAVI
IX,A,VELDURTHI PRIYADARSHINI,Female,SUBRAHMANYAM,VENKATA RAMANA
IX,A,VELUDURTHY SRAVANI,Female,SUBRAHMANYAM,LAKSHMI NAGA DURGA
IX,A,YALLA PRAMODH KUMAR,Male,GANGADHARA RAO,JYOTHI
X,A,ANNADEVARA PRATIPA SRI,Female,ADINARAYANA,RATNA KUMARI
X,A,BANDARU DURGA PRASAD,Male,GANGA RAJU,SATYAVATHI
X,A,ELLE NAVYA,Female,SIVAPRASAD,DEVI
X,A,ENJE SRIVALLI,Female,RAJESH,DIVYA
X,A,KASANI VINAY VENKATA KRISHNA,Male,SURESH,MAHALAKSHMI
X,A,KAYALA VARSHINI,Female,DANAYYA,SUJATHA
X,A,KOMALA ANJANEYULU,Male,VENKATESWA RAO,VENKATA LAKSHMI
X,A,KOMATI LAKSHMAN,Male,PRASAD,SUJATHA
X,A,MARIDU GAGANA,Female,VENKATA KRISHNA,SATYAVENI
X,A,MARISETTI RAMBABU,Male,VENKATARAO,NAGA JYOTHI
X,A,MIDDE RAMYA,Female,RAMBABU,RAMALAKSHMI
X,A,MIDDE SUBRAHMANYAM,Male,VENKATESWARARAO,SATYAVATHI
X,A,MUPPIDI LOKESH,Male,RAJU,VEERA VENI
X,A,PARLA ANUSHA,Female,RAVI,DHANALAKSHMI
X,A,PARLA SUBASHINI,Female,SRINU,MARIYAMMA
X,A,PATURI VAMSI,Male,RAJU,DIVYA
X,A,POLUMURI PRANEETH,Male,DURGARAO,PADMA
X,A,PRATTIPATI DHANA VARSHITHA,Female,VENKATESWARLU,VENKATALAKSHMI
X,A,RELANGI INDUMANI,Female,BABU,VARALAKSHMI
X,A,RELANGI YUGA VENKATA KRISHNA SATYA PHANINDRA,Male,BABU,VARALAKSHMI
X,A,SHAIK AMMAJI,Female,POSIYYA,BEGUM
X,A,UBA AKHILA,Female,SANTHOSHAM,VIJAYA LAKSHMI
X,A,VAKA DIVYA,Female,NAGARAJU,MANGA
X,A,VANDE PRAVALLIKA,Female,RAVI,JAYAMANI
X,A,VELPURI VEERA MANIKANTA,Male,SRINU,SATYAVATHI`;

importStudentData(csvData)
    .then(() => {
        console.log('Import completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Import failed:', error);
        process.exit(1);
    });
