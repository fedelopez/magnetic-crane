export default function Box(name, color, x, y, height, width) {
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
}

Box.prototype.getHeight = function () {
    return this.height;
};

Box.prototype.getWidth = function () {
    return this.width;
};