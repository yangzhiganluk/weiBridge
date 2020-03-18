export default {
    toFixed(num, d) {
        num *= Math.pow(10, d);
        num = Math.round(num);
        return num / (Math.pow(10, d));
    }
}