export default function ConsoleLog(data) {
    if (process.env.NODE_ENV === 'production') return;
    console.log(data);
}