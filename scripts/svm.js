SVM = function() {
	/* y = w[0] + w[1] * x[1] + w[2] * x[2] + ... + w[n] * x[n]
	 * y = b + W.*X
	 * Implicitly assumed x[0] = 1;
	 */
	me = this;
	me.learning_rate = 0.01;
	me.weight_decay = 0.001;
	me.train = function(data, label, weights, callback, max_itr, call_itr) {

		for(it = 0; it < max_itr; it++) {
			i = Math.floor((Math.random() * data.length));
			sgd_update(weights, data[i], label[i]);
			if(it % call_itr == 0) {
				callback(weights);
				error = training_error(weight, data, label);
				if(error <= 0.1) me.learning_rate *= 0.8;
				else if(error <= 0.2) me.learning_rate *= 0.9;
			}
		}
	};
	
	training_error = function(w, d, l) {
		error = 0;
		for(i = 0; i < d.length; i++) {
			if(dot(w, d[i]) * l < 0.0) error ++;
		}
		return error / d.length;
	};

	dot = function(w, x) {
		dt = 0.0;
		for(i = 1; i < w.length; i++) {
			dt += w[i] * x[i];
		}
		return dt;
	};
	
	len = function(w) { 
		length = 0.0;
		for(i = 1; i < w.length; i++) {
			length += w[i] * w[i];
		}
		return Math.sqrt(length);
	};

	sgd_update = function(weights, data, label) {
		pull = 0.0;
		margin = dot(weights, data) / len(weights);
		
		if(margin < 1.0 && label == 1) {
			pull = Math.min(1, 1 - margin);
		} else if(margin > -1.0 && label = -1) {
			pull = Math.min(-1, -1 - margin);
		}

		weights[0] += me.learning_rate * pull * data[0];
		for(i = 1; i < weights.length; i++) {
			weights[i] += me.learning_rate * (pull * data[i] 
				- me.weight_decay * weights[i]);
		}
	}
};