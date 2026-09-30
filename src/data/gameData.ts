// ====== MỖI NGÀY MỘT NGHỀ — GAME DATA & DIALOGUES ======
import type { Job, FoodItem, PricingOption, NPC, EndingData, EndingId } from '../types';

// ============ JOBS ============
export const JOBS: Job[] = [
  {
    id: 'VE_CHAI',
    name: 'Ve Chai Linh Kiện',
    icon: '',
    description: 'Lượm linh kiện cũ, lau RAM, hàn tụ, ráp PC rẻ.',
    flavorText: '"Cái RAM này mà thổi bụi xong cắm lại là chạy ngon ơ!"',
    baseCost: 200000,
    baseRevenue: 850000,
    craftTime: 3,
    items: [
      { id: 'ram_stick', name: 'RAM cũ đã lau', icon: '', ingredientCost: 50000, basePrice: 300000, craftTimeMs: 3000 },
      { id: 'psu_repair', name: 'Nguồn noname sửa', icon: '', ingredientCost: 100000, basePrice: 500000, craftTimeMs: 4000 },
      { id: 'cap_solder', name: 'Tụ hàn lại', icon: '', ingredientCost: 30000, basePrice: 200000, craftTimeMs: 2500 },
    ],
  },
  {
    id: 'BUN_LONG',
    name: 'Quán Bún Lòng & Phở Gánh',
    icon: '',
    description: 'Nấu bún lòng, phở gánh đêm. Bán nhiều lãi mỏng.',
    flavorText: '"Nước dùng sôi sùng sục, thơm nức mũi cả xóm!"',
    baseCost: 200000,
    baseRevenue: 750000,
    craftTime: 2,
    items: [
      { id: 'bun_long', name: 'Bún lòng nóng', icon: '', ingredientCost: 50000, basePrice: 250000, craftTimeMs: 2000 },
      { id: 'pho_bo', name: 'Phở bò tái', icon: '', ingredientCost: 80000, basePrice: 350000, craftTimeMs: 2500 },
      { id: 'nuoc_ngot', name: 'Nước ngọt lon', icon: '', ingredientCost: 20000, basePrice: 100000, craftTimeMs: 500 },
    ],
  },
  {
    id: 'SUA_KHOA',
    name: 'Sửa Khoá & Bơm Vá Vỉa Hè',
    icon: '',
    description: 'Vốn ít, thu đều. Tốn sức lao động chân tay.',
    flavorText: '"Chìa khoá mất thì tìm thợ, xe thủng thì tìm tui!"',
    baseCost: 50000,
    baseRevenue: 500000,
    craftTime: 2,
    items: [
      { id: 'sua_khoa', name: 'Sửa khoá cửa', icon: '', ingredientCost: 20000, basePrice: 250000, craftTimeMs: 3000 },
      { id: 'bom_va', name: 'Vá xe máy', icon: '', ingredientCost: 10000, basePrice: 150000, craftTimeMs: 2000 },
      { id: 'lam_chia', name: 'Làm chìa khoá', icon: '', ingredientCost: 30000, basePrice: 300000, craftTimeMs: 3500 },
    ],
  },
  {
    id: 'LAP_TRINH',
    name: 'Lập Trình Viên Dạo',
    icon: '',
    description: 'Fix bug freelance, cài Win dạo. Vốn 0, tốn não.',
    flavorText: '"Anh ơi cài lại Win cho em, em trả 50k nha!"',
    baseCost: 0,
    baseRevenue: 600000,
    craftTime: 3,
    items: [
      { id: 'cai_win', name: 'Cài Win dạo', icon: '🪟', ingredientCost: 0, basePrice: 500000, craftTimeMs: 4000 },
      { id: 'fix_bug', name: 'Fix bug freelance', icon: '', ingredientCost: 0, basePrice: 800000, craftTimeMs: 5000 },
      { id: 'setup_wifi', name: 'Cài đặt WiFi', icon: '', ingredientCost: 0, basePrice: 300000, craftTimeMs: 2000 },
    ],
  },
];

// ============ FOOD ============
export const FOOD_ITEMS: FoodItem[] = [
  { id: 'banh_mi', name: 'Bánh mì ốp la', icon: '', cost: 15000, hungerRestore: 30, energyRestore: 10 },
  { id: 'com_binh_dan', name: 'Cơm bình dân', icon: '', cost: 25000, hungerRestore: 60, energyRestore: 25 },
  { id: 'ca_phe', name: 'Cà phê sữa đá', icon: '', cost: 12000, hungerRestore: 5, energyRestore: 40 },
  { id: 'xoi', name: 'Xôi mặn gà xé', icon: '', cost: 18000, hungerRestore: 45, energyRestore: 15 },
  { id: 'tra_da', name: 'Trà đá vỉa hè', icon: '', cost: 3000, hungerRestore: 3, energyRestore: 10 },
  { id: 'dog_food', name: 'Bát cơm thừa (cho Dũng)', icon: '', cost: 10000, hungerRestore: 40, energyRestore: 0, forDog: true },
  { id: 'dog_meat', name: 'Xương gặm (cho Dũng)', icon: '', cost: 20000, hungerRestore: 70, energyRestore: 0, forDog: true },
];

// ============ PRICING ============
export const PRICING_OPTIONS: PricingOption[] = [
  {
    tier: 'BINH_DAN',
    label: 'Giá Bình Dân',
    description: 'Lãi mỏng, bán nhanh, an toàn tuyệt đối.',
    marginMultiplier: 1.15,
    suspicionIncrease: 0,
    angerIncrease: 0,
    salesSpeedMultiplier: 1.5,
  },
  {
    tier: 'HOP_LY',
    label: 'Giá Hợp Lý',
    description: 'Lãi tạm ổn, hơi bị để ý.',
    marginMultiplier: 1.6,
    suspicionIncrease: 15,
    angerIncrease: 5,
    salesSpeedMultiplier: 1.0,
  },
  {
    tier: 'CHAT_CHEM',
    label: 'Chặt Chém ×3',
    description: 'LÃI KH NG! Nhưng coi chừng bị đập...',
    marginMultiplier: 3.0,
    suspicionIncrease: 45,
    angerIncrease: 35,
    salesSpeedMultiplier: 0.4,
  },
];

// ============ NPCs ============
export const NPCS: NPC[] = [
  {
    id: 'tra',
    name: 'Trà',
    icon: '',
    role: 'Bán nước mía',
    color: '#4ade80',
    dialogues: [
      '"Mày làm ăn kiểu gì mà suốt ngày thiếu trước hụt sau vậy hả?!"',
      '"Thôi đưa con Dũng đây tao cho nó miếng xương, tội nghiệp!"',
      '"Mày mà bị thằng nào bắt nạt thì kêu tao, tao quật chổi cho!"',
      '"Ê, hôm nay nước mía tao ế quá, mày uống giúp tao ly đi!"',
    ],
  },
  {
    id: 'ngoc',
    name: 'Ngọc',
    icon: '🪭',
    role: 'Bán quạt handmade',
    color: '#f472b6',
    dialogues: [
      '"Nắng quá trời nắng! Mua quạt cho con Dũng đi bạn ơi!"',
      '"Quạt tao làm bằng tay đó nha, đẹp hơn quạt Tàu nhiều!"',
      '"Ráng lên nha, tao cũng từng nợ nần rồi mới ra đây bán quạt đó."',
    ],
  },
  {
    id: 'bang',
    name: 'Băng',
    icon: '',
    role: 'Cựu influencer',
    color: '#a78bfa',
    dialogues: [
      '"Hồi xưa tao có 500k followers... giờ ngồi đây ăn bún riêu..."',
      '"Mạng xã hội nó ảo lắm bạn ơi. Chỉ có nợ là thật thôi."',
      '"Mày biết không, tao bị cancel vì review nhầm quán phở. Dân mạng kinh lắm."',
    ],
  },
  {
    id: 'nhung',
    name: 'Nhung',
    icon: '',
    role: 'Hướng dẫn viên du lịch',
    color: '#fbbf24',
    dialogues: [
      '"Ê, tao dẫn mấy ông Tây lại đây mua đồ nha, bán đẹp vào!"',
      '"Tourist season! Nói tiếng Anh được thì tính giá đặc biệt!"',
      '"Mấy ông Tây khoái đồ handmade lắm, ráng bày biện đẹp đi!"',
    ],
  },
  {
    id: 'tom',
    name: 'Anh Tôm',
    icon: '',
    role: 'Tù nhân cứng đầu',
    color: '#ef4444',
    dialogues: [
      '"Học Bách khoa cho lắm vào! Đọc bao nhiêu sách vở rồi sau này về bán đệm cho mẹ à?!"',
      '"Ở trong này thì phải biết luật rừng, hiểu chưa em?"',
      '"Tao bị bắt vì đánh thằng nợ. Nhưng đánh xong thì hả dạ lắm!"',
    ],
  },
  {
    id: 'sv_bachkhoa',
    name: 'SV Bách Khoa',
    icon: '',
    role: 'Sinh viên ăn trộm dây đồng',
    color: '#38bdf8',
    dialogues: [
      '"Anh thì biết cái quái gì về định luật Ohm với vi mạch tích hợp mà tinh tướng?!"',
      '"Em chỉ lấy có 3 mét dây đồng thôi mà cũng bị bắt..."',
      '"Ra tù em sẽ đi làm đàng hoàng, không ăn cắp nữa đâu..."',
    ],
  },
];

// ============ INTRO DIALOGUES ============
export const INTRO_DIALOGUES: string[] = [
  '... Một đêm mưa rơi trên phố Hà Nội.',
  'Từ CEO công ty tech tỷ đô... trở thành kẻ trắng tay.',
  'Cổ phiếu sập, đối tác bỏ chạy, tài khoản đóng băng.',
  'Trong túi chỉ còn đúng 100.000đ và một tấm vé cũ mèm nhàu nát.',
  '"Mỗi Ngày Một Nghề" — Tấm vé bí ẩn hứa hẹn cơ hội mới mỗi sáng.',
  '*Gâu gâu!* ',
  'Một con chó hoang gầy guộc đang nằm co ro bên thùng rác.',
  'Nó nhìn bạn bằng đôi mắt buồn rười rượi... Bạn gọi nó là Dũng.',
  ' Nợ Cụ Bá: 20.000.000đ. Lãi: 50.000đ/ngày.',
  '⏰ Thời hạn: 14 ngày. Hết hạn = bị xiết tất cả.',
  'Bạn siết chặt tấm vé trong tay, bước ra con phố tối.',
  'Hành trình sinh tồn vỉa hè... bắt đầu. ',
];

// ============ NIGHT VOICES ============
export const NIGHT_VOICES: string[] = [
  '"Đêm rồi, ngủ đi cháu. Đồng tiền ban ngày nhặt ngoài đường, ban đêm nhớ giữ lấy cái tâm cho lành."',
  '"Ngã một cái để biết đất nó cứng thế nào. Đứng thẳng cái lưng lên, lau mặt đi rồi mai ra mà dọn lại sạp..."',
  '"Người ta sống trên đời, miếng cơm manh áo là gốc, nhưng cái tâm mới là rễ cháu ạ."',
  '"Đừng sợ khổ, sợ nhất là quên mất mình đã từng muốn sống tử tế."',
  '"Cơm tù hay cơm nhà, nuốt trôi được thì vẫn là sống cháu ạ."',
  '"Sáng mai mặt trời lại mọc. Miễn cháu còn đứng được là còn cơ hội."',
];

// ============ WEDDING DIALOGUES (Day 7) ============
export const WEDDING_DIALOGUES: string[] = [
  ' Bạn nhận được một phong bì đỏ... Đám cưới của Khánh — người bạn cùng ký túc xá năm xưa.',
  'Khánh giờ là sĩ quan quân đội, đám cưới ở Sông Thương, Bắc Giang.',
  ' Chi 40.000đ tiền xe khách đi Bắc Giang...',
  'Đến nơi, bạn định lẻn vào góc khuất vì quần áo rách rưới...',
  'Nhưng Khánh từ trên sân khấu nhảy xuống, chạy đến ôm chầm lấy bạn:',
  '"Ngày ở ký túc, mày giả nghèo để sống chung với bọn tao. Giờ mày nghèo thật thì đã sao? Thiếu mày thì đám cưới tao coi như vứt!"',
  ' Gặp lại bạn cũ:',
  'Tùng — môi giới bất động sản, nói nhiều nhưng tốt bụng: "Lên Hà Nội tao giới thiệu khách cho!"',
  'Nguyên — kỹ sư phần cứng, lặng lẽ dúi 200.000đ vào túi áo bạn:',
  '"Cầm lấy mua thịt cho con Dũng, vượt qua đợt này rồi làm lại từ đầu."',
  ' Bạn nuốt nước mắt, nắm chặt tay bạn bè. Ngày mai... lại chiến đấu.',
];

// ============ JAIL DIALOGUES ============
export const JAIL_INTRO: string[] = [
  ' Nhà tạm giam — Đêm lạnh, ánh đèn vàng vọt.',
  'Tiếng song sắt kêu leng keng... ai đó đang tìm cách vượt ngục.',
  'Trong buồng giam, hai người đang cãi nhau kịch liệt:',
];

export const JAIL_ARGUMENT: Array<{ speaker: string; text: string; color: string }> = [
  { speaker: 'Tôm', text: '"Học Bách khoa cho lắm vào! Đọc bao nhiêu sách vở rồi sau này về bán đệm cho mẹ à?!"', color: '#ef4444' },
  { speaker: 'SV BK', text: '"Anh thì biết cái quái gì về định luật Ohm với vi mạch tích hợp mà tinh tướng?!"', color: '#38bdf8' },
  { speaker: 'Tôm', text: '"Ohm ohm cái gì? (Quay sang bạn) Này thằng kia, làm ba cái trò vá xe bẩn thỉu kiếm mấy đồng bạc lẻ làm gì. Ra ngoài này theo tao, ba ngày bằng mày cày cả năm."', color: '#ef4444' },
  { speaker: 'Tôm', text: '"Lát tao dùng dây kẽm bẻ khoá. Mày theo tao không?"', color: '#ef4444' },
];

export const JAIL_ONG_DAO_VOICE =
  '"Cơm tù hay cơm nhà, nuốt trôi được thì vẫn là sống cháu ạ. Ngã một cái để biết đất nó cứng thế nào. Đứng thẳng cái lưng lên, lau mặt đi rồi mai ra mà dọn lại sạp..."';

// ============ ENDINGS ============
export const ENDINGS: Record<EndingId, EndingData> = {
  ENDING_1A_PRISON: {
    id: 'ENDING_1A_PRISON',
    title: 'Tù Tội Dài Hạn',
    subtitle: 'Bad Ending — Không ai bảo lãnh',
    mood: 'tragic',
    story: [
      'Không bạn bè, không tiền bảo lãnh...',
      'Bạn bị tuyên án giam giữ dài hạn.',
      'Cụ Bá cho người đến xiết nốt cái xe đẩy rách.',
      'Dũng lang thang ngoài cổng trại giam, đợi một người không bao giờ ra...',
      ' "Gâu... gâu..." — tiếng sủa yếu ớt vọng qua bức tường.',
    ],
  },
  ENDING_1B_FUGITIVE: {
    id: 'ENDING_1B_FUGITIVE',
    title: 'Bị Tôm Phản Bội',
    subtitle: 'Betrayal Ending — Mắc mưu trong tù',
    mood: 'tragic',
    story: [
      'Bạn đồng ý dùng dây kẽm để bẻ khoá cùng anh Tôm.',
      'Tôm lừa bạn làm mồi nhử ở hàng rào kẽm gai...',
      'Bảo vệ phát hiện! Bạn bị bắt lại và đánh đập dã man.',
      'Trong lúc hỗn loạn, Tôm đã tẩu thoát thành công.',
      'Bạn bị gánh thêm tội tổ chức vượt ngục.',
      'Án tù kéo dài thêm nhiều năm. Dũng gục chết vì đói ngoài cổng trại giam.',
    ],
  },
  ENDING_2_ROMANCE: {
    id: 'ENDING_2_ROMANCE',
    title: 'Chân Thành Cưới Phú Bà',
    subtitle: 'True Romance — Được cứu bởi tình yêu',
    mood: 'triumphant',
    story: [
      'Đêm thứ 12, một chiếc Mercedes đen bóng dừng trước sạp của bạn.',
      'Một phụ nữ bước xuống — CEO công ty tech, ăn mặc sang trọng.',
      'Cô ấy thấy bạn bán giá bình dân, trung thực, tận tụy...',
      '"Em theo dõi anh cả tuần rồi. Người đàn ông nào cũng sẽ chặt chém khi túng quẫn, nhưng anh thì không."',
      'Cô ấy trả hết 20 triệu nợ Cụ Bá, mời bạn về làm partner.',
      ' Dũng được mua vòng cổ nhung đỏ, ngồi ghế sau xe Mercedes.',
      ' Từ vỉa hè... bước lên đỉnh cao. Lần này, bằng trái tim.',
    ],
  },
  ENDING_3_UNDERCOVER: {
    id: 'ENDING_3_UNDERCOVER',
    title: 'Cảnh Sát Chìm Bắt Đáy',
    subtitle: 'Sting Ending — Bán rẻ bất thường',
    mood: 'tragic',
    story: [
      'Bạn bán hàng dưới giá vốn liên tục nhiều ngày...',
      'Cảnh sát kinh tế nghi ngờ bạn rửa tiền hoặc tiêu thụ hàng gian.',
      'Một buổi sáng, hai người mặc thường phục đến sạp:',
      '"Chào anh, chúng tôi từ phòng kinh tế. Mời anh về đồn làm việc."',
      ' Giấy tờ, sổ sách, hóa đơn... bạn không chứng minh được nguồn hàng.',
      'Bạn bị tạm giam điều tra 6 tháng.',
      'Dũng nằm buồn trước cửa đồn công an, đợi chủ.',
    ],
  },
  ENDING_4_HOSPITAL: {
    id: 'ENDING_4_HOSPITAL',
    title: 'Knock Out Chiếc Ghế Nhựa',
    subtitle: 'Hospital Bad Ending — Bị dân đập hội đồng',
    mood: 'comedic',
    story: [
      'Bạn chặt chém quá nhiều... phẫn nộ tổ dân phố lên đến 100%!',
      'Một buổi chiều, cả xóm kéo đến với ghế nhựa, chổi, và nón bảo hiểm:',
      '"CHẶT CHÉM HẢ?! ĐẬP!"',
      ' BẠCH! BẠCH! BẠCH! (Tiếng ghế nhựa va vào đầu)',
      'Bạn tỉnh dậy tại bệnh viện Bạch Mai, nợ gấp đôi do viện phí.',
      'Dũng nằm cạnh giường bệnh, liếm tay bạn:',
      ' "Gâu gâu..." (Đừng chặt chém nữa, chủ ơi...)',
    ],
  },
  ENDING_5_DUNG_BETRAYAL: {
    id: 'ENDING_5_DUNG_BETRAYAL',
    title: 'Dũng Về Với Cụ Bá',
    subtitle: 'Meme Betrayal Ending — Chó phản chủ',
    mood: 'bittersweet',
    story: [
      'Bạn quên cho Dũng ăn quá nhiều ngày liền...',
      'Loyalty = 0. Dũng đã hết kiên nhẫn.',
      'Một đêm, Dũng lặng lẽ bỏ đi trong mưa...',
      'Nó chạy thẳng về nhà Cụ Bá — chủ cũ của nó.',
      'Cụ Bá theo Dũng tìm đến chỗ ẩn náu của bạn:',
      '"A ha! Con Dũng chỉ đường cho lão rồi! Giờ mày trả nợ bằng... dắt chó cho lão 10 năm!"',
      ' Dũng liếm tay Cụ Bá, quẫy đuôi vui vẻ.',
      'Bạn trở thành người dắt chó chuyên nghiệp. 10 năm.',
    ],
  },
  ENDING_7_SOLD_DOG: {
    id: 'ENDING_7_SOLD_DOG',
    title: 'Kết cục 7: Vong Ân Bội Nghĩa',
    subtitle: 'Bán bạn cầu vinh',
    story: [
      'Ngay giữa ban ngày, hội bảo vệ động vật ập đến đánh bạn hội đồng túi bụi.',
      'Bán chó Dũng chưa kịp tiêu tiền, bạn đã phải nhập viện với thương tích đầy mình.',
      'Nhớ đời nhé, đừng bao giờ đụng vào chó của các chị em yêu động vật!'
    ],
    mood: 'tragic'
  },
  ENDING_6_TRUE_MEMORIAL: {
    id: 'ENDING_6_TRUE_MEMORIAL',
    title: 'Lời Hẹn Dưới Gốc Đào',
    subtitle: 'True Ending — Trả hết nợ, viếng Ông Đào',
    mood: 'bittersweet',
    story: [
      'Ngày thứ 14. Bạn đặt 20 triệu cuối cùng lên bàn Cụ Bá.',
      '"Cháu trả đủ rồi. Cho cháu xin lại tự do."',
      'Cụ Bá đếm tiền, gật đầu: "Được. Mày là thằng có chí. Đi đi."',
      'Bạn mua vé tàu về quê, tìm đến nhà Ông Đào — người đã dạy bạn qua những đêm tối nhất.',
      ' Nhưng trước mắt bạn chỉ là một nấm mồ phủ rêu, dưới gốc đào hoa nở rộ.',
      'Ông Đào đã mất từ nhiều năm trước.',
      'Giọng nói mỗi đêm... là tiếng lương tâm của chính bạn.',
      'Bạn quỳ xuống, đặt bó hoa lên mộ:',
      '"Cháu đã sống tử tế, ông ạ. Cháu đã giữ được cái tâm."',
      ' Dũng nằm cạnh mộ, vẫy đuôi nhẹ nhàng trong gió.',
      ' Cánh đào rơi lả tả... câu chuyện khép lại.',
    ],
  },
};

// ============ DISCLAIMER TEXT ============
export const DISCLAIMER_TEXT =
  'Trò chơi "Mỗi Ngày Một Nghề" là sản phẩm hư cấu phục vụ mục đích giải trí và trải nghiệm sinh tồn vỉa hè. Mọi danh xưng nhân vật (bao gồm chú chó Dũng, anh Tôm, Cụ Bá, các bạn sinh viên Bách khoa,...) xuất hiện trong game hoàn toàn chỉ mang tính chất định vị bối cảnh để người chơi dễ theo dõi. Trò chơi tuyệt đối KHÔNG có ý định ám chỉ, bôi nhọ, đánh đồng hay đại diện cho bất kỳ cá nhân, tổ chức hay nguyên mẫu ngoài đời thực nào. Mọi sự trùng hợp về tên gọi hoàn toàn là ngẫu nhiên.';

// ============ UTILITY ============
export function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

export function rollRandomEvent(
  taxSuspicion: number,
  mobAnger: number,
  dogLoyalty: number,
  dogHunger: number,
): 'TAX_RAID' | 'MOB_ATTACK' | 'THIEF' | 'DOG_SNATCH' | 'LUCKY' | 'NPC_VISIT' | 'NONE' {
  const roll = Math.random() * 100;

  if (mobAnger >= 100) return 'MOB_ATTACK';
  if (taxSuspicion >= 100) return 'TAX_RAID';
  if (taxSuspicion >= 70 && roll < 50) return 'TAX_RAID';
  if (mobAnger >= 70 && roll < 40) return 'MOB_ATTACK';
  if (dogHunger < 20 && dogLoyalty < 30 && roll < 25) return 'DOG_SNATCH';
  if (roll < 12) return 'THIEF';
  if (roll > 80 && roll < 92) return 'NPC_VISIT';
  if (roll > 92) return 'LUCKY';
  return 'NONE';
}

export function shouldTriggerEnding(state: {
  soldDog: boolean;
  day: number;
  debt: number;
  cash: number;
  totalHonestDays: number;
  totalCheatingDays: number;
  timesArrested: number;
  mobAnger: number;
  taxSuspicion: number;
  dog: { loyalty: number; hunger: number };
  belowCostDays: number;
  isFugitive: boolean;
}): EndingId | null {
  // Ending 5: Dũng betrayal - loyalty drops to 0
  if (state.dog.loyalty <= 0 && state.dog.hunger <= 10) {
  if (state.soldDog) return 'ENDING_7_SOLD_DOG';
    return 'ENDING_5_DUNG_BETRAYAL';
  }

  // Ending 3: Undercover sting - selling below cost too many days
  if (state.belowCostDays >= 5) {
    return 'ENDING_3_UNDERCOVER';
  }

  // Ending 4: Hospital - mob anger maxed
  if (state.mobAnger >= 100) {
    return 'ENDING_4_HOSPITAL';
  }

  // Ending 1A: Prison - arrested 3+ times with no money
  if (state.timesArrested >= 3 && state.cash < 50000) {
    return 'ENDING_1A_PRISON';
  }

  // Ending 2: Romance - honest trader with good record by day 12+
  if (state.day >= 12 && state.totalHonestDays >= 8 && state.totalCheatingDays <= 2) {
    return 'ENDING_2_ROMANCE';
  }

  // Ending 6: True ending - pay off debt
  if (state.debt <= 0 && state.day <= 14) {
    return 'ENDING_6_TRUE_MEMORIAL';
  }

  return null;
}
