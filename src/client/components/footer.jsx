import React from "react";

/*function nyan() {
  var x = [
    "america",
    "balloon",
    "bday",
    "bloon",
    "breakfast",
    "daft",
    "dub",
    "easter",
    "elevator",
    "fat",
    "fiesta",
    "floppy",
    "ganja",
    "gb",
    "grumpy",
    "j5",
    "jacksnyan",
    "jamaicnyan",
    "jazz",
    "jazzcat",
    "manyan",
    "melon",
    "mexinyan",
    "mummy",
    "newyear",
    "nyanamerica",
    "nyancat",
    "nyancoin",
    "nyaninja",
    "nyanvirus",
    "oldnyan",
    "original",
    "paddy",
    "pikanyan",
    "pirate",
    "pumpkin",
    "rasta",
    "retro",
    "sad",
    "sadnyan",
    "skrillex",
    "slomo",
    "slomocat",
    "smurfcat",
    "star",
    "starsheep",
    "tacnayn",
    "tacodog",
    "technyancolor",
    "toaster",
    "vday",
    "watermelon",
    "wtf",
    "xmas",
    "zombie"
  ];
  var style = ((w, h, r) => [
    `bottom:0;left:${r * w}px;transform:rotate(0deg);`,
    `right:-50px;bottom:${r * h}px;transform:rotate(-90deg);`,
    `top:0;right:${r * w}px;transform:rotate(180deg);`,
    `left:-50px;top:${r * h}px;transform:rotate(90deg);`
  ])(window.innerHeight, window.innerWidth, Math.random())[Math.floor(Math.random() * 4)];
  document.getElementsByTagName("body")[0].appendChild(`<img height="150px" src="/src/images/nyan/${x[Math.floor((Math.random() * x.length))]}.gif" style="position:fixed;${style}" />`);
}*/

export default class Footer extends React.Component {
  render() {
    var link1 = "";//"javascript:d=document;s=d.createElement('script');s.src='https://anohito.tw/thisUnitIsAFlippinPlatelet/flippin_platelet.js';b=d.getElementsByTagName('body')[0];b.appendChild(s);void(0);"
    var link2 = "";//"javascript:var%20KICKASSVERSION='2.0';var%20s%20=%20document.createElement('script');s.type='text/javascript';document.body.appendChild(s);s.src='//hi.kickassapp.com/kickass.js';void(0);"
    var link3 = "";//"javascript:nyan()"
    return (<div>
      <div className="container">
        <div className="row">
          <div className="col l6 s12">
            <h6 className="white-text">Made by</h6>
            <p className="grey-text text-lighten-4">&emsp;&emsp;AY(<code>erd1</code>)和他的肝</p>
            <h6 className="white-text">For</h6>
            <p className="grey-text text-lighten-4">&emsp;&emsp;<a id="toQuote">
                <code>No Code No Life</code>
              </a>從零開始的資訊讀書會</p>

          </div>
          <div className="col l6 s12">
            <h6 className="white-text">Some random stuff</h6>
            <ul>
              <li>
                <a className="white-text" href={link1}>血小板</a>
              </li>
              <li>
                <a className="white-text" href={link2}>Destroy this site</a>
              </li>
              <li>
                <a className="white-text" href={link3}>Nyan</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <div className="container">
          Made by
          <a className="brown-text text-lighten-3" href="http://materializecss.com">Materialize</a>
        </div>
      </div>
    </div>);
  }
}
