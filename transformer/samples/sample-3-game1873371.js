
let sampleSgf = `(;FF[4]EV[ut.go19.1065.1.1]PB[Malcolm Schonfield]PW[gamesorry]KM[4.5]SZ[11]SO[http://littlegolem.net/servlet/sgf/1873371/game1873371.sgf];B[ff];W[ka];B[da];W[hb];B[gk];W[ba];B[cg];W[ci];B[bb];W[ab];B[bc];W[kd];B[hd];W[fb];B[jd];W[bd];B[ec];W[hk];B[hj];W[gj];B[fk];W[hi];B[ij];W[ik];B[jj];W[fj];B[ek];W[fh];B[jh];W[hg];B[bk];W[ak];B[bj];W[dg];B[ib];W[ic];B[dh];W[eg];B[ch];W[de];B[af];W[ge];B[ee];W[id];B[he];W[gf];B[jb];W[jc];B[ha];W[jk];B[gb];W[hc];B[ia];W[gc];B[ga];W[ac];B[dd];W[ce];B[fc];W[fd];B[ed];W[kg];B[kf];W[jg];B[gd];W[ie];B[fe];W[hf];B[aj];W[ih];B[kj];W[aa];B[ej];W[kh];B[ag];W[ah];B[ca];W[bi];B[bh];W[ai];B[cd];W[be];B[cf];W[fg];B[df];W[fd];B[je];W[jf];B[ke];W[ad])`

var transform = require('../src/transform')
let sgf = transform(sampleSgf)
console.log(sgf)