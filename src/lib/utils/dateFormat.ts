export const formatJakartaTime = (dateString?: string): string => {
    const date = dateString ? new Date(dateString) : new Date();
    
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    
    const formatter = new Intl.DateTimeFormat('id-ID', options);
    const parts = formatter.formatToParts(date);
    
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    const hour = parts.find(p => p.type === 'hour')?.value;
    const minute = parts.find(p => p.type === 'minute')?.value;
    const second = parts.find(p => p.type === 'second')?.value;
    
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};