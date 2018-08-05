export class ItemData {
    constructor(name, value, description) {
        this.id = name;
        this.value = parseFloat(value);
        this.description = description;
    }
}