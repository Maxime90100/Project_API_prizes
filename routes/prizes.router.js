import express from "express";
import {getAllPrizes} from "../controllers/prizes.controller.js";
import {
    addLaureate,
    addLaureatePOST,
    updateLaureate,
    updateLaureatePOST,
    deleteLaureate,
    deleteLaureatePOST,
    getAllLaureates,
    getAllYearsLaureates
} from "../controllers/laureates.controller.js";
import {validatePrizeAttribute} from "../middlewares/prizes.middleware.js";
import {validateLaureateAttribute, validateSort} from "../middlewares/laureates.middleware.js";

var router = express.Router();

// http://localhost:3000
router.get("/prizes/:prizeAttributes?",validatePrizeAttribute,getAllPrizes);
/**
 * @swagger
 * /prize/{prizeAttribut}:
 *   get:
 *      description: Used to get all prize (F3, F4, F5, F6, F7, F10)
 *      tags:
 *          - prize
 *      parameters:
 *          - in: path
 *            name: prizeAttribut
 *            type: string, int
 *            required: false
 *            description: STRING name of the category or INT value of the year of the prize to get (Optional)
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

router.get("/laureates/:laureateAttributes?",validateLaureateAttribute,getAllLaureates);
/**
 * @swagger
 * /laureates/{laureateAttribut}:
 *   get:
 *      description: Used to get all laureates (F1, F2, F9, F12)
 *      tags:
 *          - laureate
 *      parameters:
 *          - in: path
 *            name: laureateAttribut
 *            type: string, int
 *            required: false
 *            description: STRING name of the firstname, surname or category of the laureate or INT value of the id of the laureate to get (separate attributes by +)
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

router.get("/laureate/add",addLaureate)
/**
 * @swagger
 * /laureate/add:
 *   get:
 *      description: Used to access form to add laureate (F15)
 *      tags:
 *          - laureate
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

router.post("/laureate/add",addLaureatePOST,addLaureate)
/**
 * @swagger
 * /laureate/add:
 *   post:
 *      description: Used to add laureate (F15)
 *      tags:
 *          - laureate
 *      parameters:
 *          - in: formData
 *            name: year
 *            type: int
 *            description: year of the laureate
 *          - in: formData
 *            name: category
 *            type: string
 *            description: category of the laureate
 *          - in: formData
 *            name: firstname
 *            type: string
 *            description: firstname of the laureate holder
 *          - in: formData
 *            name: surname
 *            type: string
 *            description: surname of the laureate holder
 *          - in: formData
 *            name: motivation
 *            type: string
 *            description: motivation of the laureate holder
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

router.get("/laureate/update",updateLaureate)
/**
 * @swagger
 * /laureate/update:
 *   get:
 *      description: Used to access form to update laureate (F14)
 *      tags:
 *          - laureate
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

router.post("/laureate/update",updateLaureatePOST,updateLaureate)
/**
 * @swagger
 * /laureate/update:
 *   post:
 *      description: Used to update a laureate motivation (F14)
 *      tags:
 *          - laureate
 *      parameters:
 *          - in: formData
 *            name: id
 *            type: int
 *            required: true
 *            description: id of laureate
 *          - in: formData
 *            name: year
 *            type: int
 *            required: true
 *            description: year of laureate
 *          - in: formData
 *            name: category
 *            type: string
 *            required: true
 *            description: category of laureate
 *          - in: formData
 *            name: motivation
 *            type: string
 *            required: true
 *            description: New motivation of laureate
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

router.get("/laureate/delete",deleteLaureate)
/**
 * @swagger
 * /laureate/add:
 *   get:
 *      description: Used to access form to delete laureate (F13)
 *      tags:
 *          - laureate
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

router.post("/laureate/delete",deleteLaureatePOST,deleteLaureate);
/**
 * @swagger
 * /laureate/delete:
 *   delete:
 *      description: Used to delete a laureate (F13)
 *      tags:
 *          - laureate
 *      parameters:
 *          - in: formData
 *            name: id
 *            type: int
 *            required: true
 *            description: id of laureate
 *          - in: formData
 *            name: year
 *            type: int
 *            required: true
 *            description: year of laureate
 *          - in: formData
 *            name: category
 *            type: string
 *            required: true
 *            description: category of laureate
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

router.get("/years",validateSort,getAllYearsLaureates);
/**
 * @swagger
 * /years:
 *   get:
 *      description: Used to get all years of Prizes and their number of laureate (F8, F11)
 *      tags:
 *          - year
 *      parameters:
 *          - in: query
 *            name: sort
 *            type: string
 *            required: false
 *            description: sort the result in ascending(?sort=asc) or descending(?sort=desc) order
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

export default router;