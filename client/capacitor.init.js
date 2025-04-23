
const { execSync } = require('child_process');

try {
  console.log('Initializing Capacitor...');
  execSync('npx cap init "Sri Sendhur Tex" app.lovable.8c2fac6b28854851b6f845ce32cf4738 --web-dir=dist', { stdio: 'inherit' });
  console.log('Capacitor initialized successfully!');
} catch (error) {
  console.error('Error initializing Capacitor:', error);
}
