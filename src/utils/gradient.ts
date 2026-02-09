export function gradientFromId(id: string) {
let hash = 0;
for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
}

const hue1 = ((hash % 360) + 360) % 360;
const hue2 = (hue1 + 55) % 360;

return `linear-gradient(135deg, hsl(${hue1}, 75%, 55%), hsl(${hue2}, 75%, 45%))`;
}