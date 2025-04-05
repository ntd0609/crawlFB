const random = require('randomstring');
module.exports = {
  upload: async function(req, res) {
        let {messagesample_id} = req.body;
        let fileName = random.generate(32) + '.jpg';
        req.file('image').upload({
            dirname: require('path').resolve(sails.config.appPath, 'client/static/images'),
            saveAs:fileName
        }, async function(error, uploadedFiles) {
            if(error) return res.send({error});
            let url = '/images/'+fileName;
            await Attachment.create({url,messagesample_id});
            return res.json({name:fileName,url});
        });

    },

};

