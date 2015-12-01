function Person(){
	this.first = '';
	this.last = '';
	this.email = '';
}

Person.cleanEmail = function(email){
	if (email.indexOf('@') > -1) return email.split('@')[0];
	return email;
}