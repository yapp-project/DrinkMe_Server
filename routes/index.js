// routes/index.js

module.exports = function(app, User)
{
    // GET ALL Users
    app.get('/api/users', function(req,res){
	User.find(function(err, users) {
		if(err) return res.status(500).send({error: 'database failure'});
		res.json(users);
	})

    });

    // GET SINGLE User
    app.get('/api/users/:user_id', function(req, res){
        res.end();
    });

    // GET User BY NAME
    app.get('/api/books/author/:author', function(req, res){
        res.end();
    });

    // CREATE User
    app.post('/api/users', function(req, res){
        var user = new User();
	user.user_id = req.body.id;
	user.user_pw = req.body.pw;
	user.user_name = req.body.name;
	user.signin_date = new Date(req.body.signin_date);

	user.save(function(err) {
		if(err) {
			console.error(err);
			res.json({result: 0});
			return;
		}
		res.json({result: 1});
	});
    });

    // UPDATE THE User
    app.put('/api/users/:user_id', function(req, res){
        res.end();
    });

    // DELETE User
    app.delete('/api/Users/:user_id', function(req, res){
        res.end();
    });

}
