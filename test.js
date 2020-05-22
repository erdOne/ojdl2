var curP = null, texts = "";
function resolve(){
  if(!curP)return;
	  var i = texts.indexOf('\n')+1, ret = texts.slice(0, i);
		  if(!i)return;
			  texts = texts.slice(i);
				  curP(ret);
					}
					function getline() {
					  var i = texts.indexOf('\n')+1, ret = texts.slice(0, i);
						  if(!i) return new Promise(r => (curP = r));
							  texts = texts.slice(i);
								  return ret;
									}
									function write(s){
									  return new Promise(r => 
												process.stdout.write(String(s)+'\n', { encoding: "utf-8" }, () => r())
												  );
													}
													process.stdin.on("data", v => {
													  texts += v;
														  resolve();
															});
															(async function(){
															  var l = 1, r = parseInt(await getline()) + 1;
																  while(r-l > 1){
																	    await write(l+r>>1);
																			    var a = parseInt(await getline());
																					    if(!a)process.exit(0);
																							    if(a<0)l = l+r>>1;
																									else r = l+r>>1;
																									  }
																										})();
