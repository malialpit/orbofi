


const createCountry = async(request , response) => {
    try{

    }catch(error){
        return response.status(500).send({status : false , message : error.message , data : null})
    }
}

module.exports = {
    createCountry
}