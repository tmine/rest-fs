# rest-fs
Restful service to interact with the filesystem.

| Method | Body | Description |
|---|---|---|
| GET | None | Gets the content of the file located under the specified URL. |
| PUT | Content | Creates a new file under the location specied by the URL containing the content sent in the body. |
| POST | Content | Updates the content of the file specified by the URL with the content sent in the body.  |
| DELETE | - | Deletes the file speciefied by the URL. |
