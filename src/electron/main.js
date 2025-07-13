import { app, BrowserWindow } from 'electron/main'
import path from 'path'

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    });
    win.loadFile(path.join(app.getAppPath() + '/dist-react/index.html'));
    win.setMenu(null);
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
