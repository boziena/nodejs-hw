export const updateNote = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await Note.findByIdAndUpdate(id, payload, {
    returnDocument: 'after', // ОСЬ ЦЕ МИ ВИПРАВИЛИ
  });

  if (!result) {
    return next(createError(404, 'Note not found'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated the note!',
    data: result,
  });
};
