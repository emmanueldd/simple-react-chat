// models/Message.js
import Cosmic from 'cosmicjs'

export default {
  create: (config, params, callback) => {
    const object = {
      title: params.message.substring(0,30),
      type_slug: config.bucket.type_slug,
      metafields: [
        {
          title: 'Message',
          key: 'message',
          value: params.message,
          type: 'textarea',
          edit: 1
        },
        {
          title: 'Private',
          key: 'private',
          value: params.private,
          type: 'text',
          edit: 1
        }
      ],
      options: {
        slug_field: 0,
        content_editor: 0,
        add_metafields: 0,
        metafields_title: 0,
        metafields_key: 0
      }
    }
    Cosmic.addObject(config, object, (err, res) => {
      const new_object = res.object
      const message = {
        _id: new_object._id,
        metafield: {
          message: {
            value: new_object.metafields[0].value
          },
          private: {
            value: new_object.metafields[1].value
          }
        }
      }
      callback(message)
    })
  }
}
