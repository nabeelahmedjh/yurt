export const botMarkdown = `# Code Examples with Different Languages

## JavaScript Example
\`\`\`javascript
function calculateSum(arr) {
    return arr.reduce((sum, num) => sum + num, 0);
}

const numbers = [1, 2, 3, 4, 5];
console.log(calculateSum(numbers)); // Output: 15
\`\`\`

## Complex JavaScript Example
\`\`\`javascript
// Object to store user data
const userData = {
    users: [],
    
    addUser: function(name, email) {
        this.users.push({ name, email });
        console.log(\`User added: \${name} (\${email})\`);
    },

    displayUsers: function() {
        console.clear();
        console.log("Current Users:");
        this.users.forEach((user, index) => {
            console.log(\`\${index + 1}. \${user.name} - \${user.email}\`);
        });
    },

    validateEmail: function(email) {
        const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        return emailPattern.test(email);
    }
};

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
        alert('Please fill in all fields.');
        return;
    }

    if (!userData.validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    userData.addUser(name, email);
    userData.displayUsers();
    
    // Reset form fields
    nameInput.value = '';
    emailInput.value = '';
}

// Setup form event listener
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    form.addEventListener('submit', handleFormSubmit);
});
\`\`\`

## Python Example with Classes
\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

dog = Dog("Rex")
print(dog.speak())  # Output: Rex says Woof!
\`\`\`

## TypeScript Interface Example
\`\`\`typescript
interface User {
    id: number;
    name: string;
    email?: string;
}

const user: User = {
    id: 1,
    name: "John Doe",
    email: "john@example.com"
};

function greetUser(user: User): string {
    return \`Hello, \${user.name}!\`;
}
\`\`\`

## CSS Example
\`\`\`css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    background: linear-gradient(to right, #ff0000, #00ff00);
}

.card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
\`\`\`

## Inline Code Examples
Here's some inline code: \`const x = 42;\` and here's some more: \`console.log("Hello")\`

## Shell Commands
\`\`\`bash
#!/bin/bash
echo "Installing dependencies..."
npm install
npm run build
echo "Build complete!"
\`\`\`

## JSON Example
\`\`\`json
{
    "name": "project-name",
    "version": "1.0.0",
    "dependencies": {
        "react": "^18.0.0",
        "typescript": "^4.8.0"
    },
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build"
    }
}
\`\`\`

---

This markdown includes:
- Multiple language examples
- Inline code
- Headers
- Lists
- Horizontal rule
`;
