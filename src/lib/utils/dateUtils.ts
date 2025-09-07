export const getIndonesiaTime = (): string => {
    const now = new Date();
    const offset = 7 * 60 * 60 * 1000;
    const indonesiaTime = new Date(now.getTime() + offset);
    const isoString = indonesiaTime.toISOString();
    return isoString.replace('Z', '+07:00');
};

export const formatIndonesiaTime = (dateString: string | null): string => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};