interface Window {
    electronAPI: {
        runGoCode: (code: string) => Promise<string>
    };
}