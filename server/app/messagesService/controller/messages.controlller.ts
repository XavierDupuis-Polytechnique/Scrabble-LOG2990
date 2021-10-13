// import { Request, Response, Router } from 'express';
// import { Service } from 'typedi';

// @Service()
// export class MessagesController {
//     router: Router;

//     constructor() {
//         this.configureRouter();
//     }

//     private configureRouter(): void {
//         this.router = Router();

//         this.router.get('/', (req: Request, res: Response) => {
//             // Send the request to the service and send the response
//             req.socket.emit('hello', 'hi');
//             res.json({
//                 title: 'hello',
//                 body: 'hi',
//             });
//             // this.dateService
//             //     .currentTime()
//             //     .then((time: Message) => {
//             //         res.json(time);
//             //     })
//             //     .catch((reason: unknown) => {
//             //         const errorMessage: Message = {
//             //             title: 'Error',
//             //             body: reason as string,
//             //         };
//             //         res.json(errorMessage);
//             //     });
//         });
//     }
// }
