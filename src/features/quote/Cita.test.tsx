import { API_URL } from "../../app/constants";
import {rest} from "msw";
import { mockedQuotes } from "./test/mockedQuotes";
import { Provider } from "react-redux";
import Cita from "./Cita";
import { store } from "../../app/store";
import { setupServer } from "msw/node";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "../../test-utils";


const randomQuote = mockedQuotes[1];

const validQueries = mockedQuotes.map((q) => q.query);


const handlers = [
    rest.get(`${API_URL}`, (req, res, ctx) => {
      const character = req.url.searchParams.get('character');
  
      if (character === null) {
        return res(ctx.json([randomQuote]), ctx.delay(200));
      }
  
      if (validQueries.includes(character)) {
        const quote = mockedQuotes.find((q) => q.query === character);
        return res(ctx.json([quote?.data]));
      }
  
      return res(ctx.json([]), ctx.delay(150));
    }),
  ];

  const server = setupServer(...handlers);
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  const Component = () => (
    render(
      <Cita/>
    )
   
  )


describe("Cita component" , () => {
    describe("Why the component is loaded by default", ()=> {
      
        it.skip('Sould render correctly', () => {
          Component();
          expect(screen.getByText(/no se encontro ninguna cita/i)).toBeInTheDocument();
        });
        it.skip("Should Display a 'None quote found' message", () =>{
          Component();
          expect(screen.getByText(/no se encontro ninguna cita/i)).toBeInTheDocument();
        })
    });

    describe("When the user does not complete the input", () => {
      it("Should display a loading message while data is being fetched", ()=>{
        Component();
        fireEvent.reset(screen.getByRole("textbox", {name:/Author Cita/i}));
        fireEvent.click(screen.getByRole("button", {name: /Obtener Cita/i}))
        expect(screen.getByText(/cargando/i)).toBeInTheDocument();
      });

      it.skip("Should display a random quote when the user clicks the button", async () => {
        act(() => {
          Component();
        })
          screen.debug();
        fireEvent.click(screen.getByRole("button", {name: /Obtener Cita aleatoria/i}))
        // await waitFor(()=> {
        //   // expect(screen.findByText(/cargando/i)).toBeInTheDocument();
        // })
      });
    });
})
