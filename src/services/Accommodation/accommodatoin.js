import { Router } from 'express'
import AcomModel from './schema.js'
import createHttpError from 'http-errors'

const acomRouter = Router()


acomRouter.get('/', async (req, res, next) => {
    try {
        const data = await AcomModel.find({})
        res.send(data)
    } catch (error) {
        console.log(error);
    }
})


acomRouter.get('/:id', async (req, res, next) => {
    try {
        const data = await AcomModel.findById(req.params.id)
        if (data) {
            res.send(data)
        } else {
            next(createHttpError(404, `Accommodation with id # ${req.params.id} cannot be found!`))
        }
    } catch (error) {
        console.log(error);
    }
})


acomRouter.post('/', async (req, res, next) => {

    try {
        const newData = new AcomModel(req.body)
        await newData.save()
        res.status(201).send(newData)
    } catch (error) {
        next(error);
    }
})


acomRouter.put('/:id', async (req, res, next) => {
    try {
        const updateData = await AcomModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
        if (updateData) {
            res.send(updateData)
        } else {
            next(createHttpError(404, `Accommodation with id # ${req.params.id} cannot be found!`))
        }

    } catch (error) {
        console.log(error);
    }
})


acomRouter.delete('/:id', async (req, res, next) => {
    try {
        const deleteData = await AcomModel.findByIdAndDelete(req.params.id)
        if (deleteData) {
            res.status(204).send(`The Accommodation with ID #${req.params.id} has been successfully deleted!`)
        } else {
            next(createHttpError(404, `Accommodation with id ${req.params.id} has not been found!`))
        }

    } catch (error) {
        console.log(error);
    }
})


export default acomRouter