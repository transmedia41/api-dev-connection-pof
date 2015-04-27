var _ = require('underscore'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Sector = mongoose.model('Sector'),
        ActionPoint = mongoose.model('ActionPoint'),
        ActionPolygon = mongoose.model('ActionPolygon'),
        Character = mongoose.model('Character'),
        Event = mongoose.model('Event'),
        Rank = mongoose.model('Rank'),
        Document = mongoose.model('Document'),
        fs = require('fs')


module.exports = function (app) {
    app.use('/api/v1/data', router);
};


function readJSONFile(filename, callback) {
    fs.readFile(filename, function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        try {
            callback(null, JSON.parse(data));
        } catch (exception) {
            callback(exception);
        }
    });
}


function populateSectors() {
    Sector.find().remove().exec();
    Character.find().remove().exec();
    ActionPoint.find().remove().exec();
    ActionPolygon.find().remove().exec();
    readJSONFile('app/resources/actionPolygon.json', function (err, polygons) {
        var actionPolygon = [];
        for (var k = 0; k < _.size(polygons); k++) {
            var apoly = new ActionPolygon();
            apoly.name = polygons[k].name;
            apoly.description = polygons[k].description;
            apoly.smallIcon = polygons[k].smallIcon;
            apoly.bigIcon = polygons[k].bigIcon;
            apoly.accessLevel = polygons[k].accessLevel;
            apoly.maxXp = polygons[k].maxXp;
            apoly.coolDown = polygons[k].coolDown;
            apoly.lastPerformed = polygons[k].lastPerformed;
            apoly.save();
            actionPolygon.push(apoly);
        }
        readJSONFile('app/resources/characters.json', function (err, characters) {
            for (var i = 0; i < _.size(characters); i++) {
                var c = new Character();
                c.status = characters[i].status;
                c.lastname = characters[i].lastname;
                c.firstname = characters[i].firstname;
                c.nickname = characters[i].nickname;
                c.life = characters[i].life;
                c.personality = characters[i].personality;
                c.twitch = characters[i].twitch;
                c.vice = characters[i].vice;
                c.drink = characters[i].drink;
                c.strength = characters[i].strength;
                c.weakness = characters[i].weakness;
                c.distinctive = characters[i].distinctive;
                c.body = characters[i].body;
                c.family = characters[i].family;
                c.weapon = characters[i].weapon;
                c.save();
                //console.log(characters[i])
                populateSector(characters[i], c, actionPolygon);
            }

        });
    });

}

function populateSector(character, c, actionPolygon) {
    
  
    readJSONFile('app/resources/sectors.json', function (err, sectors) {
        
        for (var i = 0; i < _.size(sectors); i++) {
            
            if (sectors[i].properties.character == character.id) {
                
                var s = new Sector()
                s.geometry = {}
                s.geometry.atype = sectors[i].geometry.type
                s.geometry.coordinates = sectors[i].geometry.coordinates
                
                s.type = sectors[i].type
                populateActionPoints(sectors[i], s, c, actionPolygon)

            }
        }
    });

}

function populateActionPoints(sector, s, c, actionPolygon) {
    readJSONFile('app/resources/' + sector.properties.actionsPoint[0], function (err, points) {
        var actionPoints = [];
        for (var j = 0; j < _.size(points); j++) {
            var apoint = new ActionPoint();
            apoint.type = points[j].type;
            apoint.geometry.atype = points[j].geometry.type;
            apoint.geometry.coordinates = points[j].geometry.coordinates;
            apoint.properties.atype = points[j].properties.type;
            apoint.properties.name = points[j].properties.name;
            apoint.properties.description = points[j].properties.description;
            apoint.properties.icon = points[j].properties.icon;
            apoint.properties.accessLevel = points[j].properties.accessLevel;
            apoint.properties.maxXp = points[j].properties.maxXp;
            apoint.properties.influence = points[j].properties.influence;
            apoint.properties.coolDown = points[j].properties.coolDown;
            apoint.properties.lastPerformed = points[j].properties.lastPerformed;
            apoint.properties.actionRadius = points[j].properties.actionRadius;
            apoint.save();
            actionPoints.push(apoint._id);
        }
        s.properties.actionsPoint = actionPoints;
        s.properties.actionsPolygon = actionPolygon;
        s.properties.character = c._id;
        s.properties.nbActions = sector.properties.nbActions;
        s.properties.influence = sector.properties.influence;
        s.properties.nomsquart = sector.properties.nomsquart;
        //console.log(s)
        s.save();
    });
}

function populateEvents() {
    Document.find().remove().exec();
    Event.find().remove().exec();
    readJSONFile('app/resources/events.json', function (err, events) {
    
        for (var i = 0; i < events.length; i++) {
            populateDocuments(events[i]);     
        }

    });

}

function populateDocuments(event) {
    readJSONFile('app/resources/'+event.documents, function (err, documents) {
        var documentList = [];
        for (var i = 0; i < documents.length; i++) {
            var document = new Document();
            document.title = documents[i].title;
            document.thumbnail = documents[i].thumbnail;
            document.versionUrl = documents[i].versionUrl;
            document.src = documents[i].src;
            document.type = documents[i].type;
            document.templateHtml = documents[i].templateHtml;
            document.xp = documents[i].xp;
            document.save();
            documentList.push(document)
        }
        var e = new Event();
        e.order = event.order;
        e.date = event.date;
        e.description = event.description;
        e.xp = event.xp;
        e.documents = documentList;
        e.save();
       
    


    });
    
}


function populateRanks() {
    Rank.find().remove().exec()
    readJSONFile('app/resources/ranks.json', function (err, ranks) {
        for (var i = 0; i < ranks.length; i++) {
          
            var rank = new Rank()
            rank.level = ranks[i].level
            rank.rankName = ranks[i].rankName
            rank.xp = ranks[i].xp
            rank.xpMax = ranks[i].xpMax
            rank.save()
            
        }
    })
}



function populateDatabase() {
    populateSectors();
    populateEvents();
    populateRanks()
}


populateDatabase();


router.route('/populate')
        .post(function (req, res, next) {
            res.json(populateDatabase());
        });