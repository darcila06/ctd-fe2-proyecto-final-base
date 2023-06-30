import { API_URL } from "../../app/constants";
import {rest} from "msw";
import { mockedQuotes } from "./test/mockedQuotes";
import { Provider } from "react-redux";
import Cita from "./Cita";
import { store } from "../../app/store";
import { setupServer } from "msw/node";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "../../test-utils";
import  userEvent from "@testing-library/user-event";


const randomQuote = mockedQuotes[1].data;

const validQueries = mockedQuotes.map((q) => q.query);
const data = [
  {
    quote:"I used to be with it. But then they changed what it was. Now what I'm with isn't it, and what's it seems scary and wierd. It'll happen to you.",
    character: "Abe Simpson",
    image: "https://cdn.glitch.com/3c3ffadc-3406-4440-bb95-d40ec8fcde72%2FAbrahamSimpson.png?1497567511593",
    characterDirection: "Right",
  }
]

const handlers = [
    rest.get(`${API_URL}`, (req, res, ctx) => {
      // const character = req.url.searchParams.get('character');
  
      // if (character === null) {
        return res(ctx.json(data), ctx.delay(200));
      // }
  
      // if (validQueries.includes(character)) {
      //   const quote = mockedQuotes.find((q) => q.query === character);
      //   return res(ctx.json([quote?.data]));
      // }
  
      // return res(ctx.json([]), ctx.delay(150));
    }),
  ];

  const server = setupServer(...handlers);
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());




describe("Cita component" , () => {
    describe("Why the component is loaded by default", ()=> {
      
        it('Sould render correctly', async () => {
          render(
            <Cita/>
          )
          // expect(screen.getByText(/no se encontro ninguna cita/i)).toBeInTheDocument();
          expect(
            screen.getByText(/No se encontro ninguna cita/i)
          ).toBeInTheDocument();
        });
        it.skip("Should Display a 'None quote found' message", () =>{
          render(
            <Cita/>
          )
          expect(screen.getByText(/no se encontro ninguna cita/i)).toBeInTheDocument();
        })
    });

    describe("When the user does not complete the input", () => {
      it.skip("Should display a loading message while data is being fetched", ()=>{
        render(
          <Cita/>
        )
        fireEvent.reset(screen.getByRole("textbox", {name:/Author Cita/i}));
        fireEvent.click(screen.getByRole("button", {name: /Obtener Cita/i}))
        expect(screen.getByText(/cargando/i)).toBeInTheDocument();
      });

      it("Should display a random quote when the user clicks the button", async () => {
        render(
          <Cita/>
        )
        // Verifica la respuesta simulada
        // expect(data.message).toBe('');
        //   render(<Component/>)
        //   screen.debug();
        userEvent.click(screen.getByRole("button", {name: /Obtener Cita aleatoria/i}))
        // await waitFor(()=> {
          screen.debug()
        //   // expect(screen.findByText(/cargando/i)).toBeInTheDocument();
        // })
      });
    });
})
