import type { PricingTier } from '../types';

export type ScenarioKind = 'PRICE' | 'GOSSIP' | 'GAME';

export interface ReplyChoice {
  /** Short text on the button, describes what the player does. */
  readonly label: string;
  /** Line the protagonist says on screen after the button is pressed. */
  readonly comeback: string;
  /** Change applied to mobAnger when this reply is chosen. */
  readonly angerDelta: number;
}

export interface Scenario {
  readonly id: string;
  readonly kind: ScenarioKind;
  /** What the customer says. The three choices below respond to this exact line. */
  readonly quote: string;
  readonly choices: readonly [ReplyChoice, ReplyChoice, ReplyChoice];
}

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'PRICE_EXPENSIVE',
    kind: 'PRICE',
    quote: '"Ối giời ôi, món này đắt thế?! Nguyên liệu nhập từ sao Hỏa về à?!"',
    choices: [
      {
        label: 'Giải thích giá cả',
        comeback: 'Bác cứ dùng thử dịch vụ xem có xứng đồng tiền không, em không nói điêu đâu.',
        angerDelta: -10,
      },
      {
        label: 'Bật lại gắt gỏng',
        comeback: 'Chê đắt thì ra ngã tư cho rẻ nhé!',
        angerDelta: 5,
      },
      {
        label: 'Đùa cho qua chuyện',
        comeback: 'Sản phẩm này tốt nghiệp Bách khoa đấy bác, chất lượng khỏi bàn!',
        angerDelta: 0,
      },
    ],
  },
  {
    id: 'PRICE_HALF_SALARY',
    kind: 'PRICE',
    quote: '"Giá này bằng nửa ngày lương của tôi đấy! Bớt đi chứ chủ quán!"',
    choices: [
      {
        label: 'Từ chối khéo',
        comeback: 'Bác thông cảm, giá niêm yết rõ ràng rồi, em không bớt được đâu ạ.',
        angerDelta: -10,
      },
      {
        label: 'Chặn họng luôn',
        comeback: 'Muốn rẻ thì bác về nhà tự làm, quán em không phải hội từ thiện!',
        angerDelta: 5,
      },
      {
        label: 'Trả treo hài hước',
        comeback: 'Bớt thì được, nhưng em bớt luôn cả chất lượng đấy bác nhé!',
        angerDelta: 0,
      },
    ],
  },
  {
    id: 'PRICE_STUDENT',
    kind: 'PRICE',
    quote: '"Em là sinh viên Bách khoa, ví mỏng lắm. Bớt cho em mười nghìn được không anh?"',
    choices: [
      {
        label: 'Thông cảm cho sinh viên',
        comeback: 'Sinh viên thì anh bớt tí, lần sau nhớ rủ thêm bạn bè ra ủng hộ nhé.',
        angerDelta: -10,
      },
      {
        label: 'Từ chối thẳng thừng',
        comeback: 'Bách khoa giỏi tính toán thì tự tính xem bớt kiểu gì đi em!',
        angerDelta: 5,
      },
      {
        label: 'Hỏi chuyện học hành',
        comeback: 'Ngành gì mà đói thế em, ngồi đây kể anh nghe xem nào.',
        angerDelta: 0,
      },
    ],
  },
  {
    id: 'GOSSIP_WEDDING',
    kind: 'GOSSIP',
    quote: '"Biết tin gì chưa chủ quán? Con bé Hà bán quạt sắp cưới anh IT rồi đấy!"',
    choices: [
      {
        label: 'Chúc mừng cặp đôi',
        comeback: 'Hay quá bác ơi, em xin gửi lời chúc hai bạn trăm năm hạnh phúc.',
        angerDelta: -10,
      },
      {
        label: 'Cà khịa anh IT',
        comeback: 'Bảo anh IT viết prompt nhờ AI sửa quạt hộ xem có chạy nổi không!',
        angerDelta: 5,
      },
      {
        label: 'Lảng sang chuyện khác',
        comeback: 'Chuyện nhà người ta bác ơi, bác lo nhận hàng đi kìa!',
        angerDelta: 0,
      },
    ],
  },
  {
    id: 'GOSSIP_DOG',
    kind: 'GOSSIP',
    quote: '"Con chó Dũng của chủ quán đâu rồi? Hôm nay không thấy nó ra đón khách."',
    choices: [
      {
        label: 'Báo Dũng đang ngủ',
        comeback: 'Nó đang ngủ sau quầy đấy bác, no bụng là nó tha cho cả phố.',
        angerDelta: -10,
      },
      {
        label: 'Gắt vì bị hỏi nhiều',
        comeback: 'Chó nhà em quý hơn khách hay hỏi, bác lo việc của bác đi!',
        angerDelta: 5,
      },
      {
        label: 'Bịa chuyện cho vui',
        comeback: 'Dũng đi họp hội đồng chó phố cổ rồi bác ơi, chiều mới về!',
        angerDelta: 0,
      },
    ],
  },
  {
    id: 'GOSSIP_FAKE_FOOD',
    kind: 'GOSSIP',
    quote: '"Nghe nói anh Tôm buôn hàng giả bị phường để ý rồi. Quán anh có dính dáng gì hắn không?"',
    choices: [
      {
        label: 'Khẳng định uy tín',
        comeback: 'Quán em làm ăn rõ ràng, bác cứ yên tâm sử dụng dịch vụ.',
        angerDelta: -10,
      },
      {
        label: 'Gắt vì bị đồn thổi',
        comeback: 'Không có bằng chứng thì đừng đồn đại, dùng xong trả tiền giúp em!',
        angerDelta: 5,
      },
      {
        label: 'Đánh trống lảng',
        comeback: 'Em chỉ biết bán hàng thôi bác, chuyện phường xã để phường xã lo!',
        angerDelta: 0,
      },
    ],
  },
  {
    id: 'GAME_PUBG',
    kind: 'GAME',
    quote: '"Anh xóa tận gốc PUBG trong máy chưa? Cả cộng đồng đang rủ nhau xóa game đấy!"',
    choices: [
      {
        label: 'Nói chuyện nhẹ nhàng',
        comeback: 'Game chỉ để giải trí, thấy bất công thì dẹp sang một bên cho nhẹ đầu bác ạ.',
        angerDelta: -10,
      },
      {
        label: 'Mắng thẳng mặt',
        comeback: 'Chơi dở đổ thừa hoàn cảnh! Lo thanh toán tiền đi bác!',
        angerDelta: 5,
      },
      {
        label: 'Lươn lẹo cho qua',
        comeback: 'Em xóa từ sáng rồi, giờ lo cày tiền trả nợ thôi bác ơi!',
        angerDelta: 0,
      },
    ],
  },
];

export function getScenario(index: number): Scenario {
  return SCENARIOS[index] ?? SCENARIOS[0];
}

/**
 * Picks a scenario index. Overcharging draws mostly from price complaints,
 * other tiers draw mostly from gossip and game talk. Never repeats the last one.
 */
export function pickScenarioIndex(tier: PricingTier, lastIndex: number): number {
  const wantsPrice = tier === 'CHAT_CHEM' ? Math.random() < 0.7 : Math.random() < 0.15;
  const pool: number[] = [];
  SCENARIOS.forEach((scenario, index) => {
    if (index === lastIndex) return;
    const isPrice = scenario.kind === 'PRICE';
    if (isPrice === wantsPrice) pool.push(index);
  });
  if (pool.length === 0) return 0;
  return pool[Math.floor(Math.random() * pool.length)];
}
