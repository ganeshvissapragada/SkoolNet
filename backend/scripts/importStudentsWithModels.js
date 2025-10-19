require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Create a new Sequelize instance using the DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

// Define User model
const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'teacher', 'parent', 'student'), allowNull: false }
});

// Define Student model
const Student = sequelize.define('Student', {
    name: DataTypes.STRING,
    class: DataTypes.STRING,
    section: DataTypes.STRING,
    parent_id: { type: DataTypes.INTEGER, allowNull: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true }
});

const bcrypt = require('bcryptjs');
const fs = require('fs');

const studentData = [
    // Class VI-A
    { class: 'VI', section: 'A', name: 'ARIGELA KANTHI MAI', gender: 'Female', fatherName: 'ANAND BABU', motherName: 'MANJU' },
    // ... existing student data ...
];

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

async function importData() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');

        const credentials = [];
        const parentUsers = new Map(); // Store parent users by name

        // Start a single transaction for all operations
        await sequelize.transaction(async (t) => {
            // Process each student
            for (const data of studentData) {
                try {
                    // Check if parent already exists
                    let fatherUser, fatherPassword;
                    if (parentUsers.has(data.fatherName)) {
                        const parentInfo = parentUsers.get(data.fatherName);
                        fatherUser = parentInfo.user;
                        fatherPassword = parentInfo.password;
                    } else {
                        const fatherEmail = await generateEmail(data.fatherName, 'parent');
                        const parentInfo = await createUser(data.fatherName, 'parent', fatherEmail);
                        fatherUser = parentInfo.user;
                        fatherPassword = parentInfo.plainPassword;
                        parentUsers.set(data.fatherName, { user: fatherUser, password: fatherPassword });
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
                        parent_id: fatherUser.id
                    }, { transaction: t });

                    // Store credentials for later output
                    credentials.push({
                        student: { name: data.name, email: studentEmail, password: studentPassword },
                        father: { name: data.fatherName, email: fatherUser.email, password: fatherPassword }
                    });

                    console.log(`Created student: ${data.name}`);
                } catch (error) {
                    console.error(`Error processing student ${data.name}:`, error.message);
                    throw error; // Rollback the transaction if any error occurs
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
        console.log('Data import completed successfully.');
        console.log('Credentials have been saved to credentials.txt');
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
}

importData();
