var fs = require('fs');
eval(fs.readFileSync('test.js')+'');

var params = new Object;

ParseConfig(params);

describe( 'BATCH-GET FUNCTION', function() {
	it ( 'SIMPLE BATCH-GET TEST' , function() {
		var m = 0;
		for ( var i = 0; i < 4*n; i++ ) {
			var key = { ns: params.ns, set: params.set, key:"BATCHGET"+i };
			var rec= GetRecord(i);
			client.put(key, rec, function( err, meta, key) {
				expect(err).to.exist;
				expect(err.code).to.equal(return_code.AEROSPIKE_OK);
				if ( ++m == 4*n) {
					m = 0;
				} 
			});
		}
	if ( m == 0) 
	{	
		for ( var i = 0; i < n; i++) {
			var K_array = [ {ns:params.ns, set:params.set, key:"BATCHGET" +  1 },
							{ns:params.ns, set:params.set, key:"BATCHGET" +  2 },
							{ns:params.ns, set:params.set, key:"BATCHGET" +  3 },
							{ns:params.ns, set:params.set, key:"BATCHGET" +  4 } ];
			client.batch_get(K_array, function(err, rec_list){
				expect(err).to.exist;
				expect(err.code).to.equal(return_code.AEROSPIKE_OK);
				expect(rec_list.length).to.equal(4);
				for ( var j = 0; j < rec_list.length; j++) {
					expect(rec_list[j].recstatus).to.equal(return_code.AEROSPIKE_OK);
					var ind = rec_list[j].record.key.key.substr(8);
					expect(rec_list[j].record.bins.string_bin).to.equal(ind);
					expect(rec_list[j].record.bins.integer_bin).to.equal(parseInt(ind));
					var obj = msgpack.unpack(rec_list[j].record.bins.blob_bin);
					expect(obj.integer).to.equal(parseInt(ind));
					expect(obj.string).to.equal('Some String');
					expect(obj.array).to.eql([1,2,3]);
					if ( ++m == n ) {
						n = 4*n;
						CleanRecords('BATCHGET');
					}
				}
			});
		}
	}
	});

});

