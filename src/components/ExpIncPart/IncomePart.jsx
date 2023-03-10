import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addIncome,
  getIncomeCategories,
  getIncomeStats,
} from 'redux/Transaction/transactionOperations';
import {
  getBalance,
  getCurrentDate,
  getIncomesCategories,
  getIncomesMonthStats,
  getIncomesTransactions,
  getIsLoading,
} from 'redux/Transaction/transactionSelectors';
import s from './ExpIncPart.module.css';
import { Calendar } from 'components/Calendar/Calendar';
import { Calculator } from 'components/Calculator/Calculator';
import { Loader } from 'components/Loader/Loader';
import Button from 'components/Buttons/Button/Button';
import { SummaryTable } from 'components/SummaryTable/SummaryTable';
import { TransactionTable } from 'components/TransactionTable/TransactionTable';
import { useLocation } from 'react-router-dom';
import { Translator } from 'components/Translator/Translator';
import { setNewDate } from 'redux/Transaction/transactionReducer';
import { IncomeSmile } from 'components/IncomeSmile/IncomeSmile';
import useSound from 'use-sound';
import input from '../../sounds/input.mp3';
import clear from '../../sounds/clear.mp3';

export const IncomePart = () => {
  const [playInput] = useSound(input);
  const [playClear] = useSound(clear);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [sum, setSum] = useState('');
  const [list, setList] = useState(false);
  const [emptyInput, setEmptyInput] = useState(false);
  const loading = useSelector(getIsLoading) === true;
  const prodInc = useSelector(getIncomesCategories);
  const incomesTransactionData = useSelector(getIncomesTransactions);
  const incomesSummaryData = useSelector(getIncomesMonthStats);
  const balance = useSelector(getBalance);
  const dispatch = useDispatch();
  const pageLocation = useLocation().pathname;
  const newDate = useSelector(getCurrentDate);

  useEffect(() => {
    dispatch(getIncomeCategories());
    dispatch(getIncomeStats());
    if (newDate === null) {
      dispatch(setNewDate(new Date()));
    }
  }, [dispatch, balance, newDate]);

  const handleChangeForm = evt => {
    const { value, name } = evt.target;
    switch (name) {
      case 'description':
        setDescription(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'sum':
        setSum(value);
        break;
      default:
        return;
    }
  };

  const handleResetForm = () => {
    setEmptyInput(false);
    setDescription('');
    setCategory('');
    setSum('');
    playClear();
  };

  const handleSubmitForm = evt => {
    evt.preventDefault();

    if (!description) {
      setEmptyInput(true);
      return;
    }
    if (!category) {
      setEmptyInput(true);
      return;
    }
    if (!sum) {
      setEmptyInput(true);
      return;
    }
    const items = {
      description: description,
      amount: Number(sum),
      date: newDate.toISOString().slice(0, 10),
      category: category,
    };
    playInput();
    dispatch(addIncome(items));
    handleResetForm();
  };
  const handleIsListTogle = () => {
    setList(!list);
  };

  const handleCloseByDrope = evt => {
    if (evt.target === evt.currentTarget) {
      setList(!list);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.contentContainer}>
        <div className={s.backToMain}>
          <a href="/React-team-project/Main">
            <svg
              width="18"
              height="12"
              viewBox="0 0 18 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d=" M18 5H3.83L7.41 1.41L6 0L0 6L6 12L7.41 10.59L3.83 7H18V5Z"
                fill="#FF751D"
              ></path>
            </svg>
          </a>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className={s.formContainer}>
              <div className={s.calendar}>
                <Calendar selected={newDate} />
              </div>
              <form className={s.form} onSubmit={handleSubmitForm}>
                <input
                  className={s.inputDescription}
                  placeholder="Product description"
                  autoComplete="off"
                  type="text"
                  name="description"
                  value={description}
                  onChange={handleChangeForm}
                />

                <div className={s.inputCategoryContainer}>
                  <button
                    className={s.inputCategory}
                    onClick={handleIsListTogle}
                    type="button"
                  >
                    {category ? (
                      <p style={{ color: '#52555F' }}>{Translator(category)}</p>
                    ) : (
                      <p style={{ color: '#c7ccdc' }}>Product category</p>
                    )}
                    <span className={s.arrow}>&#129171;</span>
                  </button>
                  {list && (
                    <>
                      <div
                        className={s.overlay}
                        onClick={handleCloseByDrope}
                      ></div>
                      <ul className={s.listCategory}>
                        {prodInc.map((el, ind) => (
                          <li
                            value={el}
                            key={ind}
                            className={s.itemCategory}
                            onClick={() => {
                              setCategory(el);
                              handleIsListTogle();
                            }}
                          >
                            {Translator(el)}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                <div className={s.errContainer}>
                  <p className={s.errDescriptionMsg}>
                    {!description && emptyInput && 'Enter description!'}
                  </p>
                  <p className={s.errCategoryMsg}>
                    {!category && emptyInput && 'Select category!'}
                  </p>
                  <p className={s.errSummMsg}>
                    {!sum && emptyInput && 'Enter sum!'}
                  </p>
                </div>
                <div className={s.inputSummContainer}>
                  <input
                    className={s.inputSumm}
                    placeholder="0,00"
                    type="number"
                    name="sum"
                    value={sum}
                    onChange={handleChangeForm}
                  />
                  <Calculator />
                </div>
              </form>
              <div className={s.buttonContainer}>
                <Button
                  text={'INPUT'}
                  type={'submit'}
                  onClick={handleSubmitForm}
                />
                <Button
                  text={'CLEAR'}
                  type={'button'}
                  onClick={handleResetForm}
                />
              </div>
            </div>

            <div className={s.tableContainer}>
              <div className={s.prods}>
                {incomesTransactionData.length > 0 ? (
                  <TransactionTable
                    transactionData={incomesTransactionData}
                    tablePage={pageLocation}
                  />
                ) : (
                  <IncomeSmile />
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <div className={s.sumary}>
        <SummaryTable summaryData={incomesSummaryData} />
      </div>
    </div>
  );
};
