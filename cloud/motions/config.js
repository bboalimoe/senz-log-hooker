exports.config = {
    "debug":
        true,
    "source_db":
    {
      "APP_KEY": "" ,
      "APP_ID": "",
      "MASTER_KEY":""
    },

    "target_db":
    {
      "APP_KEY": "qs4o5iiywp86eznvok4tmhul360jczk7y67qj0ywbcq35iia" ,
      "APP_ID": "pin72fr1iaxb7sus6newp250a4pl2n5i36032ubrck4bej81",
      "MASTER_KEY":"fxnfxlh16vdd3oc740y83tvaw4pohkk5w39y01axhsu2rhqt",
      "target_class":"UserMotion"
    },
    "serv_url" :  "http://182.92.4.173/motions/",
    //"serv_url":"http://api.senz.me/senz/pois/"
    "stat_dict":['Sitting', 'Driving', 'Riding', 'Walking', 'Running'],
     //STAT_DICT = {'Sitting':0, 'Driving':1, 'Riding':2, 'Walking':3, 'Running': 4}

    "log_tag": "motions ==> "
    };

