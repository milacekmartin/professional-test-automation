export const userSchema = {
    "definitions": {  },
    "$schema": "userSchema",
    "$id": "userSchema",
    "title": "Root",
    "type": "object",

    "required": [
        "id",
        "name",
        "job",
        "createdAt"
    ],

    "properties": {
        "id": {
            "$id": "#root/id",
            "title": "id",
            "type": "string",
            "default": ""
        },

        "name": {
            "$id": "#root/name",
            "title": "name",
            "type": "string",
            "default": ""
        },

        "job": {
            "$id": "#root/job",
            "title": "job",
            "type": "string",
            "default": ""
        },

        "createdAt": {
            "$id": "#root/createdAt",
            "title": "createdAt",
            "type": "string",
            "default": ""
        }
    }
}
