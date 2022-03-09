


//x,y

let yercekimi = 0.11;
let gunesinKutlesi = 40;
let maddeSayisi = 89;
let kuyrukUzunluğu = 8;
let kuyrukKalinlik = 4;
let baslangicHizlari = [1.5, 0];
let kuyrukRengi = 'blue'
let maddeRengi = 'white'
let FPS = 80;
let uzaklik;
let dunyaSicakligi = 24;


let Hiz = function (x, y) {
    this.x = x;
    this.y = y;
}

Hiz.prototype.hizArtir = function (x, y) {
    this.x += x;
    this.y += y;

}

let Madde = function (kutle, x, y, sabitMi) {
    this.kutle = kutle;
    this.sabitMi = sabitMi;

    if (!sabitMi) {
        // Sabit değilse bir hızı vardır.Bu yüzden maddeye hız ataması yapılır.
        this.hiz = new Hiz(baslangicHizlari[0], baslangicHizlari[1]);
    }
    else {
        // Sabittir ve hızı [x,y] = [0,0]
        this.hiz = new Hiz(0, 0);
    }


    this.x = x;
    this.y = y;
    this.sonX = x;
    this.sonY = y;

}

Madde.prototype.cekmeKuvveti = function (digerMadde, sim) {
    if (this.sabitMi) {
        //Eğer sabitse herhangi bir çekme kuvveti hesaplaması yapma
        return;
    }

    else {
        // Formül için gerekli çıkartmalar
        // Formül -> İki cisim arası uzaklığı kordinat sistemine göre bulma
        // x1,y1 -> 1. Madde Kordinatları
        // x2,y2 -> 2. Madde Kordinatları
        // Uzaklık ise Karekök((|x2-x1|)² + (|y2-y1|)²) ile bulunabilir. 
        let xFark = digerMadde.x - this.x;
        let yFark = digerMadde.y - this.y;

        // İki cisim arası uzaklık
        uzaklik = Math.sqrt(
            Math.pow(xFark, 2) + Math.pow(yFark, 2)
        )

        

        // Her maddenin az olsa çekme kuvveti vardır.Aslında kütle çekim kuvveti daha doğru olur
        // Bunu hesaplamak için ise şu formül yeterlidir.
        // KÇF = G* M₁* M₂ / r² -> G Sabittir. 1. madde ile 2.madde'nin kütleleri çarpımının aralarındaki mesafenin karesine oranı.
        // Tabi biz burda bir simülasyon yaptığımız için G sabitini kullanmayacağız. :D
        // Bir çekim etkisi oluşması için ise yerÇekimi değişkenini oluşturacağız.Tabiki bu değer her madde için farklı.
        // Ancak biz simülasyon gereği her maddenin yer çekimini sabit bir sayı kullanacağız. 
        let cekmeKuvveti = Math.abs(sim.yercekimi) * digerMadde.kutle * this.kutle / Math.pow(uzaklik, 2);
        // Artık kütle çekimin etkisinde olduğumuz için merkeze uzaklığımız bizim hızımızı etkiler.Dolayısıyla
        // aşağıdaki hesaplamayı yapmak durumundayız.
        xFark = xFark * cekmeKuvveti / this.kutle;
        yFark = yFark * cekmeKuvveti / this.kutle;
        this.hiz.hizArtir(xFark, yFark);
    }


}
Madde.prototype.adim = function () {
    this.sonX = this.x; // Bir önceki x 'i şuanki x'e eşitleyip bir sonraki adıma geçiyoruz
    this.sonY = this.y;// Bir önceki y'yi şuanki y'ye eşitleyip bir sonraki adıma geçiyoruz
    this.x += this.hiz.x; // Kordinatımızı hızımızın ivmelendiğimiz yöne doğru artırıyoruz.
    this.y += this.hiz.y; //Çünkü kütle çekim arttıkça dönüş hızımız artar
};

Madde.prototype.ciz = function () {
    stroke(kuyrukRengi);
    strokeWeight(kuyrukKalinlik);
    line(this.x, this.y, this.sonX, this.sonY);
    strokeWeight(1);
    fill(maddeRengi);

    // Aşağıdaki if'in amacı normalde kütlesi fazla olan maddelerin daha büyük çizilmesidir.(Simülasyon Gereği)
    // Elbetteki kütlesi büyük olup hacmi az olan maddelerde vardır.Ancak sim gereği kütle ile boyut orantılıdır
    // Ancak maddelerin çok fazla büyük olmaması için ve ekranda yer kaplamaması için basit bir sorgu var.

    if (this.kutle > 30) {
        ellipse(this.x, this.y, 80, 80);
    }
    else {
        ellipse(this.x, this.y, 1, 1);
    }

};

let Simulasyon = function () {
    this.maddeler = [];
    this.yercekimi = yercekimi;
};

Simulasyon.prototype.simulasyonaMaddeEkle = function (kutle, x, y, sabitMi) {
    this.maddeler.push(new Madde(kutle, x, y, sabitMi));
};

Simulasyon.prototype.hizlariGuncelle = function () {
    for (var i in this.maddeler) {
        for (var j in this.maddeler) {
            if (i !== j) {
                this.maddeler[i]
                    .cekmeKuvveti(this.maddeler[j], this);
            }
        }
    }
};

Simulasyon.prototype.maddelerinHareketi = function () {
    for (var i in this.maddeler) {
        this.maddeler[i].adim();
    }
};

Simulasyon.prototype.adim = function () {
    this.hizlariGuncelle();
    this.maddelerinHareketi();
};

Simulasyon.prototype.ciz = function () {
    for (var x in this.maddeler) {
        this.maddeler[x].ciz();
    }
    fill(255, 255, 255);
    text(this.maddeler.length - 1 + " tane madde var", 9, 18);

};




let sim = new Simulasyon();
// Güneşi Oluştur
sim.simulasyonaMaddeEkle(gunesinKutlesi, 196, 188, true);

sim.simulasyonaMaddeEkle(101, 500, 450, true);






// Madde sayisi kadar madde ekleme
for (let i = 0; i < 1; i++) {
    sim.simulasyonaMaddeEkle(5, 80,360, false);
}

function setup() {
    createCanvas(1000, 600)
}
// Ve p5.js ile ekrana çizdirme
function draw() {
    frameRate(FPS);
    fill(28, 29, 73, 100 / kuyrukUzunluğu);
    rect(0, 0, 800, 800);
    fill(255, 255, 255);
    sim.ciz();
    sim.adim();
}
setInterval(() => {
    console.log(uzaklik, '[' ,dunyaSicakligi,'] [',yercekimi,']' );
    if(uzaklik < 100) {
        dunyaSicakligi ++;
        yercekimi+=Math.random();
        
    }
    if(uzaklik > 200) {
        dunyaSicakligi --;
        yercekimi-=Math.random();

        
    }
},500)