import { defineConfig } from 'taze';

export default defineConfig({
    packageMode: {
        '/^@tb-dev/': 'major',
        electron: 'major',
        mechanus: 'major'
    }
});