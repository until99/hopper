from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime

with DAG(
    dag_id="teste_minimal",
    start_date=datetime(2024, 1, 1),
    schedule="@once",
) as dag:

    task = BashOperator(
        task_id="print_test",
        bash_command='echo "DAG funcional!"',
    )
